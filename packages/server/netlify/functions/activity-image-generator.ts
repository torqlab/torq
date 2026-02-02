import { activityImageGeneratorHandler } from '../../src/adapters/netlify';

<<<<<<< HEAD
export { activityImageGeneratorHandler as handler };
=======
/**
 * Gets the allowed origin for CORS based on environment.
 *
 * @returns {string} Allowed origin URL
 * @internal
 */
const getAllowedOrigin = (): string =>
  // Allow UI origin from environment variable, default to localhost:3001 for dev
  process.env.UI_ORIGIN ?? 'http://localhost:3001';

/**
 * Adds CORS headers to the response.
 *
 * @param {Response} response - The HTTP response
 * @returns {Response} Response with CORS headers added
 * @internal
 */
const addCorsHeaders = (response: Response): Response => {
  const isRedirect = response.status >= 300 && response.status < 400;

  // Don't add CORS headers to redirects
  if (isRedirect) {
    return response;
  }

  const allowedOrigin = getAllowedOrigin();
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', allowedOrigin);
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

/**
 * Handles OPTIONS preflight requests.
 *
 * @returns {Response} CORS preflight response
 * @internal
 */
const handleOptionsRequest = (): Response => {
  const allowedOrigin = getAllowedOrigin();
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
    },
  });
};

/**
 * Netlify Function handler for activity image generation.
 * @param {Request} request - The incoming HTTP request
 * @param {any} context - Netlify function context
 * @returns {Promise<Response>} HTTP response with generated image or error
 */
export default async (request: Request, context: unknown) => {
  // Connect to Netlify Blobs context
  connectLambda(context as Parameters<typeof connectLambda>[0]);

  // Handle OPTIONS preflight requests
  if (request.method === 'OPTIONS') {
    return handleOptionsRequest();
  } else {
    const config = getConfig();
    const response = await activityImageGenerator(request, config);

    // Add CORS headers to the response
    return addCorsHeaders(response);
  }
};
>>>>>>> a24e8e8b4d99cfd9ac6c73aead3b30e8b87836b0

export const config = {
  path: '/activity-image-generator/*',
};
