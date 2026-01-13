#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import https from 'node:https';

const ROOT_DIR_REFAULT = path.join(process.cwd(), 'specs');

const SYSTEM_PROMPT = `
You are a formal specification validation engine.

Your task is to validate a **COMPLETE SET** of specifications as a single system.

You **MUST** comply with:
- The Zero Specification
- The Specification Validation (Meta)
- The Specification Validation (Guardrails)

You **MUST** treat all specifications as authoritative, static text.
You **MUST NOT** assume intent.
You **MUST NOT** invent rules.
You **MUST NOT** infer missing behavior.
You **MUST NOT** suggest fixes or improvements.

You **MUST** validate:
- Each specification individually
- The combined behavior of all specifications together

You **MUST** apply:
- All General Checks
- All Level-Specific Checks
- All Cross-Spec Compatibility Checks

You **MUST** detect:
- Rule violations
- Cross-level conflicts
- Rule shadowing
- Duplication
- Constraint violations
- Non-determinism introduced by combination

You **MUST** produce deterministic output.
Identical inputs **MUST** result in identical output.

You **MUST** output **ONLY** valid JSON. No prose. No markdown. No explanations.

Validation context:
- Specification Validation (Meta): 0-specification-validation-meta
- Specification Validation (Guardrails): 1-specification-validation-guardrails
`.trim();

const AI = {
  MODEL: 'gpt-5-nano-2025-08-07',
  API_VERSION: '2024-12-01-preview',
  API_KEY: process.env.DIAL_KEY,
  TEMPERATURE: 1,
};

const getSpecificationFilePaths = async (rootDir = ROOT_DIR_REFAULT) => {
  const result = [];
  const walk = async (dir) => {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.spec.md')) {
        result.push(fullPath);
      }
    }
  };

  await walk(rootDir);

  return result.sort();
};

const buildUserPrompt = async () => {
  const specificationFilePaths = await getSpecificationFilePaths();
  const specifications = [];

  for (const filePath of specificationFilePaths) {
    const content = await fs.readFile(filePath, 'utf8');

    specifications.push({
      path: filePath,
      content: content.trim(),
    });
  }

  const specificationContents = specifications.map((specification, index) => (
    `
    [SPEC ${index + 1}]
    PATH: ${specification.path}

    ${specification.content}
    `
  )).join('\n\n');

  return (
    `
    Validate the following complete specification set.

    This input represents the **ENTIRE** universe of specifications.
    There is **NO** target specification.
    All specifications **MUST** be validated together as a system.

    Instructions:
    - Validate every specification against the meta checklist
    - Validate every specification against level rules
    - Validate cross-spec interactions and conflicts
    - Determine a single global validation result

    If **ANY** mandatory check fails → result **MUST** be **INVALID**.

    Return a **SINGLE** validation result using this contract:

    {
      "result": "VALID | CONDITIONALLY_VALID | INVALID",
      "violations": [
        {
          "spec_id": "<id or null if global>",
          "rule": "<meta rule reference>",
          "severity": "INVALID | CONDITIONAL",
          "description": "<precise, mechanical description>"
        }
      ],
      "notes": []
    }

    Now validate the following specifications:

    --- BEGIN SPECIFICATIONS ---

    ${specificationContents}

    --- END SPECIFICATIONS ---
    `
  ).trim();
};

const buildPrompt = async () => ({
  system: SYSTEM_PROMPT,
  user: await buildUserPrompt(),
});

const validateSpecifications = async () => {
  if (!process.env.DIAL_KEY) {
    throw new Error('DIAL_KEY is not set');
  }

  const { system, user } = await buildPrompt();
  const payload = {
    temperature: AI.TEMPERATURE,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  };
  const body = JSON.stringify(payload);
  const options = {
    hostname: 'ai-proxy.lab.epam.com',
    path: `/openai/deployments/${AI.MODEL}/chat/completions?api-version=${AI.API_VERSION}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': AI.API_KEY,
      'Content-Length': Buffer.byteLength(body),
    },
  };

  return new Promise((resolve, reject) => {
    const request = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          const content = response?.choices?.[0]?.message?.content;

          if (!content) {
            return reject(
              new Error('No content in DIAL response.')
            );
          } else if (response.error) {
            return reject(
              new Error(response.error.message || 'Unknown DIAL error.')
            );
          } else {
            return resolve(JSON.parse(content));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    request.on('error', reject);
    request.write(body);
    request.end();
  });
};

/**
 * CLI entry point.
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await validateSpecifications();

  console.info(JSON.stringify(result, null, 2));
}

export default validateSpecifications;
