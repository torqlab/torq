export const ERROR_CODES = {
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_ID: 'INVALID_ID',
  PROMPT_REQUIRED: 'PROMPT_REQUIRED',
  FORBIDDEN_CONTENT: 'FORBIDDEN_CONTENT',
};

export const ERROR_MESSAGES = {
  ACTIVITY_NOT_FOUND: 'Activity not found',
  AUTHENTICATION_FAILED: 'Authentication failed',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  INVALID_ACTIVITY_ID: 'Invalid activity ID',
  ACTIVITY_PROCESSING_FAILED: 'Failed to process activity',
  ACTIVITY_ID_REQUIRED: 'Activity ID is required',
  PROMPT_REQUIRED: 'Prompt parameter is required',
  FORBIDDEN_CONTENT: 'Prompt contains forbidden content',
};

export const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
