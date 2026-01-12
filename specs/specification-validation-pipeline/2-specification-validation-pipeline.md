---
id: specification-validation-pipeline
version: 1.0.0
level: 2
status: canonical
dependencies:
  - 0-0-zero.spec.md
  - 0-1-specification-validator-checklist.spec.md
---

# Specification Validation Pipeline Specification

This specification defines the **implementation-level validation pipeline** for validating specifications using AI in automated environments (e.g. GitHub Actions).

This is a **Level 2 domain specification**.
It defines **inputs, processing steps, prompts, and outputs**.

This specification is subordinate to:
- Zero Specification
- Specification Validator Checklist

In case of conflict, higher-level specifications prevail.

## 1. Purpose

The purpose of this specification is to define:

- A **single, authoritative validation pipeline**
- Exact **AI prompts** used for validation
- Deterministic **validation execution flow**
- Machine-readable **validation output contract**

All AI-based spec validation **MUST** follow this pipeline.

## 2. Scope

This pipeline applies to:

- All `.spec.md` files
- Single-spec validation
- Cross-spec validation
- CI environments (e.g. GitHub Actions)

## 3. Pipeline Inputs

The pipeline **MUST** receive:

1. The **target specification** being validated
2. The **full set of all existing specifications**
3. The **Specification Validator Checklist**
4. The **Zero Specification**

All inputs **MUST** be treated as authoritative text sources.

Missing input → **INVALID**

## 4. Pipeline Stages

The validation pipeline **MUST** execute the following stages in order.

### 4.1 Load Stage

- Load all specification files
- Parse front matter
- Build dependency graph

Failure → **INVALID**

### 4.2 Structural Validation Stage

The pipeline **MUST** validate:

- Front matter correctness
- File naming rules
- Dependency correctness

Rules are taken **exclusively** from the checklist.

Failure → **INVALID**

### 4.3 Semantic Validation Stage

The pipeline **MUST** validate:

- Rule ownership
- Level compliance
- Forbidden content per level
- RFC 2119 language usage

Ambiguities → **CONDITIONALLY VALID**

### 4.4 Cross-Spec Validation Stage

The pipeline **MUST** validate:

- Dependency closure
- Cross-level conflicts
- Rule shadowing
- Duplication
- Constraint tightening rules
- Global determinism

Any conflict → **INVALID**

## 5. Canonical Validation Prompt

The following prompt **MUST** be used verbatim.

### 5.1 System Instruction Prompt

```text
You are a formal specification validator.

You **MUST** validate the provided specification strictly against:
- The Zero Specification
- The Specification Validator Checklist

You **MUST NOT** invent rules.
You **MUST NOT** infer intent.
You **MUST NOT** assume correctness.

You **MUST** only report violations based on explicit rules.

Your output **MUST** be deterministic.
```

### 5.2 Validation Task Prompt

Validate the provided specification.

You **MUST**:
- Apply all General Checks
- Apply Level-Specific Checks
- Apply Cross-Spec Compatibility Checks
- Consider the specification in the context of ALL provided specifications

You **MUST** identify:
- Rule violations
- Cross-level conflicts
- Rule shadowing
- Duplication
- Determinism violations

You **MUST NOT**:
- Suggest fixes
- Propose implementations
- Assume missing intent

## 6. Validation Output Contract

The validator **MUST** return valid JSON in the following format:

```json
{
  "spec_id": "<id>",
  "version": "<version>",
  "level": <number>,
  "result": "VALID | CONDITIONALLY_VALID | INVALID",
  "violations": [
    {
      "rule": "<checklist rule reference>",
      "severity": "INVALID | CONDITIONAL",
      "description": "<precise description>"
    }
  ],
  "notes": []
}
```

Rules:
- Violations **MUST** be present (empty if none)
- Result **MUST** follow checklist semantics
- Output **MUST** be deterministic

## 7. Failure Handling

If validation cannot be completed due to:
- Missing specifications
- Broken dependency graph
- Incomplete inputs

The pipeline **MUST** return:

```json
{
  "result": "INVALID",
  "violations": [
    {
      "rule": "pipeline-input",
      "severity": "INVALID",
      "description": "Validation inputs are incomplete or inconsistent"
    }
  ],
  "notes": []
}
```

## 8. Authority and Ownership

This specification:
- Is the sole owner of validation pipeline behavior
- Is the sole owner of AI validation prompts
- **MUST** be referenced by CI pipelines performing spec validation

No other specification may redefine this pipeline.

## Summary

This specification defines a single, centralized, deterministic AI validation pipeline.

Its goals are to:
- Prevent validation drift
- Centralize prompts and logic
- Make CI validation reproducible
- Keep higher-level specs purely normative

All AI-based validation **MUST** follow this specification.
