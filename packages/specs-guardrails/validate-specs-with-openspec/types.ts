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

export type ValidationSummary = {
  totals: { items: number; passed: number; failed: number };
  byType: {
    change: { items: number; passed: number; failed: number };
    spec: { items: number; passed: number; failed: number };
  };
};

export type Output = {
  success: boolean;
  exitCode: number;
  items: ValidationItem[];
  summary: ValidationSummary;
  version: string;
  stderr: string;
};
