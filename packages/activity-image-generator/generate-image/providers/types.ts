/**
 * Options for image generation across all providers.
 */
export type ImageGenerationOptions = {
  /** Image dimensions. */
  size?: '1024x1024' | '1792x1024' | '1024x1792';
};

/**
 * Common interface for all image generation providers.
 */
export type ImageProvider = {
  /**
   * Generates an image from a text prompt.
   * 
   * @param {string} prompt - Text prompt for image generation
   * @param {ImageGenerationOptions} [options] - Optional configuration
   * @returns {Promise<string>} Promise resolving to base64-encoded image data URL (data:image/png;base64,...)
   * @throws {Error} Throws error if generation fails
   */
  generateImage: (
    prompt: string,
    options?: ImageGenerationOptions
  ) => Promise<string>;
};

/**
 * Supported image generation providers.
 */
export type ProviderName = 'pollinations';
