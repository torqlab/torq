#!/usr/bin/env bun

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

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
  const walk = async (dir: string) => {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('spec.md')) {
        result.push(fullPath);
      }
    }
  };

  await walk(rootDir);

  return result.sort();
};

export default getSpecFilePaths;
