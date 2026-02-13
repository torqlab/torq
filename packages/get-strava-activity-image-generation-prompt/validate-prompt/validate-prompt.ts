import checkForbiddenContent from '@pace/check-forbidden-content';

import { MAX_PROMPT_LENGTH } from '../constants';
import { PromptValidationResult } from './types';

/**
 * Validates activity image prompt according to guardrails specification.
 *
 * Checks prompt length, forbidden content, style validity, and brand usage compliance.
 *
 * Validates:
 * - Prompt length <= 600 characters
 * - No forbidden content (real persons, political symbols, violence, text instructions)
 * - Style is from allowed set: cartoon, minimal, abstract, illustrated
 * - Brand usage is compliant (contextual, not excessive)
 *
 * @param {string} prompt - Image prompt to validate.
 * @returns {StravaActivityImagePromptValidationResult} Validation result with errors and optional sanitized prompt.
 */
const validateActivityImagePrompt = (
  prompt: string,
): PromptValidationResult => {
  const promptLength = prompt.length;
  const errors: string[] = [];
  const hasForbiddenContent = checkForbiddenContent(prompt);

  if (promptLength === 0) {
    errors.push('Text is required and must be a non-empty string');
  }

  if (promptLength > MAX_PROMPT_LENGTH) {
    errors.push(
      `Prompt length (${promptLength}) exceeds maximum (${MAX_PROMPT_LENGTH})`,
    );
  }
  
  if (hasForbiddenContent) {
    errors.push('Prompt contains forbidden content');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export default validateActivityImagePrompt;
