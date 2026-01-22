import { getAuthorizationUrl } from '@pace/strava-auth';
import type { ServerConfig } from '../../types';

/**
 * Handles GET /strava/auth - Initiates Strava OAuth flow.
 *
 * Redirects user to Strava authorization page.
 *
 * @param {Request} request - HTTP request
 * @param {ServerConfig} config - Server configuration
 * @returns {Response} Redirect response to Strava authorization URL
 */
const handleStravaAuth = (request: Request, config: ServerConfig): Response => {
  try {
    // Log the redirect URI being used for debugging
    console.log(`🔐 Initiating Strava OAuth with redirect URI: ${config.strava.redirectUri}`);
    console.log(`⚠️  Make sure this matches your Strava app's "Authorization Callback Domain" setting!`);

    const authUrl = getAuthorizationUrl({
      clientId: config.strava.clientId,
      clientSecret: config.strava.clientSecret,
      redirectUri: config.strava.redirectUri,
      scope: config.strava.scope,
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: authUrl,
      },
    });
  } catch (error) {
    // If authorization URL generation fails, redirect to error page
    console.error('Failed to generate authorization URL:', error);
    return new Response(null, {
      status: 302,
      headers: {
        Location: config.errorRedirect || '/',
      },
    });
  }
};

export default handleStravaAuth;
