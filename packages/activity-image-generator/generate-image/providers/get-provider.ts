import { ImageProvider, ProviderName } from './types';
import pollinationsProvider from './pollinations-provider';

/**
 * Gets the configured image generation provider.
 * 
 * Reads IMAGE_PROVIDER environment variable to determine which provider to use.
 * Defaults to Pollinations if not set.
 * 
 * @returns {ImageProvider} Image generation provider instance
 * @throws {Error} Throws if provider name is invalid
 * 
 * @remarks
 * Supported providers:
 * - 'pollinations' (default): Free, unlimited, no authentication
 * 
 * @example
 * ```typescript
 * // Use default (Pollinations)
 * const provider = getProvider();
 * ```
 */
const getProvider = (): ImageProvider => {
  const providerName = (process.env.IMAGE_PROVIDER || 'pollinations') as ProviderName;
  
  if (providerName === 'pollinations') {
    return pollinationsProvider;
  } else {
    throw new Error(`Unknown IMAGE_PROVIDER: ${providerName}. Supported: pollinations`);
  }
};

export default getProvider;
