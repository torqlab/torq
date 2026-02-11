/**
 * Supported image generation providers:
 * - `pollinations`: Free, unlimited, no authentication.
 */
export type ImageGenerationProviderName = 'pollinations';

/**
 * Validation result returned by guardrails validation functions.
 */
export interface ValidationResult<T = unknown> {
  /** Whether the validation passed. */
  valid: boolean;
  /** Array of error messages if validation failed. */
  errors: string[];
  /** Sanitized version of the input if validation failed but sanitization was possible. */
  sanitized?: T;
}

/**
 * Image generation prompt structure.
 */
export interface StravaActivityImagePrompt {
  /** Visual style for the image. */
  style: 'cartoon' | 'minimal' | 'abstract' | 'illustrated';
  /** Mood descriptor. */
  mood: string;
  /** Subject description. */
  subject: string;
  /** Scene/environment description. */
  scene: string;
  /** Full assembled prompt text (max 600 characters). */
  text: string;
}

export type StravaActivityImagePromptValidationResult = ValidationResult<StravaActivityImagePrompt>;
