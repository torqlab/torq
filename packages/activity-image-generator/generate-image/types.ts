import { StravaActivityImagePrompt } from '../types';

/**
 * Input for image generation.
 */
export type GenerateImageInput = {
  /** Image generation prompt from activity data. */
  prompt: StravaActivityImagePrompt;
  /** Number of retry attempts made so far. */
  retryCount?: number;
};

/**
 * Output from image generation.
 */
export type GenerateImageOutput = {
  /** URL to the generated image in DIAL storage. */
  imageUrl: string;
  /** Whether fallback was used. */
  usedFallback: boolean;
  /** Number of retries performed. */
  retriesPerformed: number;
};
