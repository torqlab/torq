#!/usr/bin/env bun

import { join, resolve, dirname } from 'node:path';
import { existsSync } from 'node:fs';

import { Output } from './types';

/**
 * Gets the path to the openspec binary.
 * Finds node_modules by walking up from rootDir until it's found.
 * This allows rootDir to be openspec/specs while node_modules is at repo root.
 * @param {string} rootDir - The root directory of the project.
 * @returns {string} The path to the openspec binary.
 */
const getOpenSpecBin = (rootDir: string): string => {
  let currentDir = resolve(rootDir);
  let openspecBin: string | null = null;
  
  while (currentDir !== dirname(currentDir)) {
    const candidateBin = join(currentDir, 'node_modules', '.bin', 'openspec');
    if (existsSync(candidateBin)) {
      openspecBin = candidateBin;
      break;
    }
    currentDir = dirname(currentDir);
  }
  
  if (!openspecBin) {
    throw new Error(`Could not find openspec binary in node_modules. Searched from ${rootDir} up to ${currentDir}`);
  }
  
  return openspecBin;
};

const validateSpecsWithOpenspec = async (rootDir: string): Promise<Output> => {
  const openspecBin = getOpenSpecBin(rootDir);
  
  const proc = Bun.spawn(
    ['bun', openspecBin, 'validate', '--all', '--strict', '--no-interactive', '--json'],
    {
      cwd: rootDir,
      stdout: 'pipe',
      stderr: 'pipe',
    }
  );

  const [stdout, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);

  const exitCode = await proc.exited;

  let validationData: {
    items: Output['items'];
    summary: Output['summary'];
    version: string;
  };

  try {
    validationData = JSON.parse(stdout.trim()) as {
      items: Output['items'];
      summary: Output['summary'];
      version: string;
    };
  } catch (error) {
    throw new Error(`Failed to parse openspec JSON output: ${error instanceof Error ? error.message : String(error)}`);
  }

  return {
    success: exitCode === 0,
    exitCode,
    items: validationData.items,
    summary: validationData.summary,
    version: validationData.version,
    stderr: stderr.trim(),
  };
};

export default validateSpecsWithOpenspec;
