import { ImageProvider, ImageGenerationOptions } from './types';

/**
 * Pollinations.ai image generation provider.
 * 
 * Completely free, no authentication required.
 * Supports multiple models: flux (default, best for illustrations), seedream, gpt-image-large, kontext.
 * Uses negative prompts to avoid common image generation issues.
 * 
 * @internal
 * @see {@link https://pollinations.ai | Pollinations.ai}
 */
const pollinationsProvider: ImageProvider = {
  generateImage: async (
    prompt: string,
    options?: ImageGenerationOptions
  ): Promise<string> => {
    // Map size to width/height
    const sizeMap = {
      '1024x1024': { width: 1024, height: 1024 },
      '1792x1024': { width: 1792, height: 1024 },
      '1024x1792': { width: 1024, height: 1792 },
    };
    const dimensions = sizeMap[options?.size ?? '1024x1024'];
    
    // Build Pollinations API URL
    const pollinationsUrl = new URL('https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt));
    pollinationsUrl.searchParams.set('width', String(dimensions.width));
    pollinationsUrl.searchParams.set('height', String(dimensions.height));
    
    // Get model from environment variable, default to flux for better illustration/cartoon quality
    // Available models: flux (best for illustrations, balanced quality), seedream (excellent prompt understanding), gpt-image-large (photorealism), kontext (context-aware)
    const model = process.env.POLLINATIONS_MODEL || 'flux';
    pollinationsUrl.searchParams.set('model', model);
    
    pollinationsUrl.searchParams.set('nologo', 'true');
    // Enable prompt enhancement - uses LLM to improve prompt for better image quality
    pollinationsUrl.searchParams.set('enhance', 'true');
    
    // Add negative prompt to avoid common image generation issues
    // Addresses: distorted faces, extra limbs, malformed hands, blurry images, low quality
    const negativePrompt = 'distorted faces, extra limbs, malformed hands, blurry, low quality, pixelated, ugly, deformed, disfigured, bad anatomy, bad proportions, extra fingers, missing fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, mutated hands, out of focus, long neck, long body';
    pollinationsUrl.searchParams.set('negative', encodeURIComponent(negativePrompt));
    
    // Add random seed to prevent caching - ensures each request generates a unique image
    pollinationsUrl.searchParams.set('seed', String(Math.floor(Math.random() * 1000000)));
    
    // Fetch image from Pollinations
    const response = await fetch(pollinationsUrl.toString());
    
    if (!response.ok) {
      throw new Error(`Pollinations API error: ${response.statusText}`);
    }
    
    // Download image and convert to base64
    const imageBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString('base64');
    
    // Return data URL
    return `data:image/png;base64,${base64}`;
  }
};

export default pollinationsProvider;
