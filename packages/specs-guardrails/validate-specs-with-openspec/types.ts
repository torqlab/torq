export type ValidationIssue = {
  level: 'ERROR' | 'WARNING';
  path: string;
  message: string;
};

export type ValidationItem = {
  id: string;
  type: 'spec' | 'change';
  valid: boolean;
  issues: ValidationIssue[];
  durationMs: number;
};

/**
 * Validation count statistics.
 */
export type ValidationCounts = {
  items: number;
  passed: number;
  failed: number;
};

/**
 * Validation counts grouped by type.
 */
export type ValidationCountsByType = {
  change: ValidationCounts;
  spec: ValidationCounts;
};

export type ValidationSummary = {
  totals: ValidationCounts;
  byType: ValidationCountsByType;
};

export type Output = {
  success: boolean;
  exitCode: number;
  items: ValidationItem[];
  summary: ValidationSummary;
  version: string;
  stderr: string;
};
