import type { ServerConfig } from '../../types';

/**
 * Handles GET / - Root path handler.
 *
 * Catches OAuth callbacks that Strava redirects to the root domain
 * (when Authorization Callback Domain is set to just the domain).
 * If OAuth parameters are present, redirects to the proper callback handler.
 *
 * @param {Request} request - HTTP request
 * @param {ServerConfig} config - Server configuration
 * @returns {Response} Redirect response to callback handler or default page
 */
const handleRoot = (request: Request, config: ServerConfig): Response => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  // If OAuth callback parameters are present, redirect to the callback handler
  if (code || error) {
    const callbackUrl = new URL('/strava/auth/callback', request.url);
    // Preserve all query parameters
    url.searchParams.forEach((value, key) => {
      callbackUrl.searchParams.set(key, value);
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: callbackUrl.toString(),
      },
    });
  }

  // Otherwise, return a simple response or redirect to a default page
  return new Response(
    JSON.stringify({
      message: 'PACE UI Server',
      endpoints: {
        auth: '/strava/auth',
      },
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

export default handleRoot;
