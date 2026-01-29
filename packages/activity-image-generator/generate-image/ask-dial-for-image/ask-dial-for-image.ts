import { CONFIG } from '../constants';
import { DialImageResponse } from './types';

/**
 * Sends an image generation request to the DIAL AI service and returns image URL.
 *
 * Makes a POST request to the DIAL (AI Proxy) service with an image generation
 * prompt. The service returns a JSON response containing an image URL in DIAL
 * storage. Handles errors and validates response structure.
 *
 * @param {string} prompt - Image generation prompt text
 * @param {object} [options] - Optional configuration
 * @param {'standard' | 'hd'} [options.quality] - Image quality (default: 'standard')
 * @param {'1024x1024' | '1792x1024' | '1024x1792'} [options.size] - Image size (default: '1024x1024')
 * @param {'vivid' | 'natural'} [options.style] - Image style (default: 'natural')
 * @returns {Promise<string>} Promise resolving to full image URL in DIAL storage
 * @throws {Error} Throws error if:
 *   - DIAL_KEY environment variable is not set
 *   - API returns an error response
 *   - Response does not contain image URL
 *
 * @remarks
 * The function makes a chat completion request to DIAL's DALL-E-3 deployment.
 * Configuration parameters (quality, size, style) are passed via custom_fields.configuration.
 * The image URL is extracted from the response attachments and returned as a full URL.
 *
 * @see {@link https://ai-proxy.lab.epam.com/ | DIAL AI Proxy Service}
 * @see {@link https://docs.dialx.ai/tutorials/developers/apps-development/multimodality/dial-cookbook/examples/how_to_call_dalle_3_with_configuration | DALL-E-3 Configuration}
 *
 * @example
 * ```typescript
 * const imageUrl = await askDialForImage('A cartoon runner in a park');
 * // Returns: 'https://ai-proxy.lab.epam.com/v1/files/.../image.png'
 * ```
 */
const askDialForImage = async (
  prompt: string,
  options?: {
    quality?: 'standard' | 'hd';
    size?: '1024x1024' | '1792x1024' | '1024x1792';
    style?: 'vivid' | 'natural';
  }
): Promise<string> => {
  if (!process.env.DIAL_KEY) {
    throw new Error('DIAL_KEY is not set');
  }

  const quality = options?.quality ?? CONFIG.DEFAULT_QUALITY;
  const size = options?.size ?? CONFIG.DEFAULT_SIZE;
  const style = options?.style ?? CONFIG.DEFAULT_STYLE;

  const body = JSON.stringify({
    messages: [
      { role: 'user', content: prompt },
    ],
    extra_body: {
      custom_fields: {
        configuration: {
          quality,
          size,
          style,
        },
      },
    },
  });

  const apiKey = String(process.env.DIAL_KEY);
  const url = `${CONFIG.BASE_URL}/openai/deployments/${CONFIG.MODEL}/chat/completions?api-version=${CONFIG.API_VERSION}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
      'Content-Length': Buffer.byteLength(body).toString(),
    },
    body,
  });

  const json = await response.json() as DialImageResponse;

  if (json.error) {
    throw new Error(json.error.message || 'Unknown DIAL error.');
  }

  const attachments = json.choices?.[0]?.message?.custom_content?.attachments;
  const imageAttachment = attachments?.find((att) => att.type?.startsWith('image/'));

  if (!imageAttachment) {
    throw new Error('No image attachment in DIAL response.');
  }

  const imageUrl = imageAttachment.url;
  if (!imageUrl) {
    throw new Error('No image URL in DIAL response attachment.');
  }

  const fullUrl = (() => {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    } else {
      return `${CONFIG.BASE_URL}/v1/${imageUrl}`;
    }
  })();

  return fullUrl;
};

export default askDialForImage;
