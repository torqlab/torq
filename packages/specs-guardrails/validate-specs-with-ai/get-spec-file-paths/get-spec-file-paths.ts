#!/usr/bin/env bun

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Recursively walks a directory tree and collects spec.md file paths.
 *
 * @param {string} dir - Directory to walk
 * @param {string[]} result - Array to collect file paths (mutated)
 * @returns {Promise<void>} Promise that resolves when walking is complete
 * @internal
 */
const walkDirectoryForSpecFiles = async (dir: string, result: string[]): Promise<void> => {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await walkDirectoryForSpecFiles(fullPath, result);
    } else if (entry.isFile() && entry.name.endsWith('spec.md')) {
      result.push(fullPath);
    }
  }
};

/**
 * Recursively finds all OpenSpec specification files in a directory.
 *
 * Walks the directory tree starting from rootDir and collects all files
 * ending with 'spec.md'. Returns absolute paths sorted alphabetically.
 *
 * @param {string} rootDir - Root directory to search for specification files
 * @returns {Promise<string[]>} Promise resolving to array of absolute file paths to spec.md files
 *
 * @example
 * ```typescript
 * const paths = await getSpecFilePaths('/path/to/openspec/specs');
 * // Returns: ['/path/to/openspec/specs/activity/spec.md', '/path/to/openspec/specs/guardrails/spec.md', ...]
 * ```
 */
const getSpecFilePaths = async (rootDir: string): Promise<string[]> => {
  const result: string[] = [];
  await walkDirectoryForSpecFiles(rootDir, result);
  return result.sort();
};

export default getSpecFilePaths;
