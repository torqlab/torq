import { GenerateImageInput, GenerateImageOutput } from './types';
import { CONFIG } from './constants';
import { StravaActivityImagePrompt } from '../types';
import { getProvider, ImageGenerationOptions } from './providers';
import simplifyPrompt from './simplify-prompt';
import getFallbackPrompt from './get-fallback-prompt';

/**
 * Attempts image generation with retry logic.
 *
 * @internal
 * @param {StravaActivityImagePrompt} currentPrompt - Current prompt to use
 * @param {number} attemptNumber - Current attempt number (0-based)
 * @param {number} maxRetries - Maximum number of retries allowed
 * @param {ImageGenerationOptions} [options] - Optional configuration
 * @returns {Promise<string>} Promise resolving to base64-encoded image data URL
 * @throws {Error} Throws error if all retries fail
 */
const attemptGeneration = async (
  currentPrompt: StravaActivityImagePrompt,
  attemptNumber: number,
  maxRetries: number,
  options?: ImageGenerationOptions
): Promise<string> => {
  const provider = getProvider(); // Get provider based on env var
  
  try {
    const imageData = await provider.generateImage(
      currentPrompt.text,
      options
    );
    return imageData;
  } catch (error) {
    if (attemptNumber < maxRetries) {
      const simplifiedPrompt = simplifyPrompt(currentPrompt, attemptNumber + 1);
      return attemptGeneration(simplifiedPrompt, attemptNumber + 1, maxRetries, options);
    } else {
      throw error;
    }
  }
};

/**
 * Generates activity image using configured AI provider.
 *
 * Provider is controlled by IMAGE_PROVIDER environment variable:
 * - 'pollinations' (default): Free, unlimited Pollinations.ai
 *
 * Implements retry logic with prompt simplification and fallback mechanism.
 * Attempts image generation up to MAX_RETRIES times, simplifying the prompt
 * on each retry. If all retries fail, uses a safe fallback prompt. Images are
 * downloaded from the provider and returned as base64-encoded data URLs.
 *
 * @param {GenerateImageInput} input - Image generation input with prompt
 * @param {ImageGenerationOptions} [options] - Optional configuration
 * @returns {Promise<GenerateImageOutput>} Promise resolving to generated image data and metadata
 * @throws {Error} Throws error if generation fails
 *
 * @remarks
 * Generation process:
 * 1. Get configured provider based on IMAGE_PROVIDER env var (defaults to Pollinations)
 * 2. Validate prompt text length (max 400 characters)
 * 3. Attempt generation with original prompt
 * 4. On failure, retry with simplified prompt (max 2 retries)
 * 5. If all retries fail, use fallback prompt
 * 6. Images are downloaded from provider and returned as base64 data URLs
 * 7. Always returns a valid base64-encoded image data URL
 *
 * @example
 * ```typescript
 * const result = await generateImage({ prompt });
 * console.log('Image data:', result.imageData);
 * console.log('Used fallback:', result.usedFallback);
 * ```
 */
const generateImage = async (
  input: GenerateImageInput,
  options?: ImageGenerationOptions
): Promise<GenerateImageOutput> => {
  const provider = getProvider();
  
  const promptText = input.prompt.text;
  if (promptText.length > 400) {
    throw new Error(`Prompt text exceeds 400 character limit: ${promptText.length} characters`);
  }

  const retryCount = input.retryCount ?? 0;
  const maxRetries = CONFIG.MAX_RETRIES;

  const result = (async (): Promise<GenerateImageOutput> => {
    try {
      const imageData = await attemptGeneration(input.prompt, 0, maxRetries, options);
      return {
        imageData,
        usedFallback: false,
        retriesPerformed: retryCount,
      };
    } catch (error) {
      const fallbackPrompt = getFallbackPrompt(input.prompt.subject);
      const fallbackImageData = await provider.generateImage(
        fallbackPrompt.text,
        options
      );
      return {
        imageData: fallbackImageData,
        usedFallback: true,
        retriesPerformed: maxRetries,
      };
    }
  })();

  return result;
};

export default generateImage;
