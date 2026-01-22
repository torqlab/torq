import type { ServerConfig } from '../types';

/**
 * Gets server configuration from environment variables.
 *
 * @returns {ServerConfig} Server configuration
 * @throws {Error} Throws if required environment variables are missing
 */
const getConfig = (): ServerConfig => {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  const redirectUri = process.env.STRAVA_REDIRECT_URI || 'http://localhost:3000/strava/auth/callback';

  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing required environment variables: STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET are required'
    );
  }

  const isProduction = process.env.NODE_ENV === 'production';

  return {
    port: Number.parseInt(process.env.PORT || '3000', 10),
    hostname: process.env.HOSTNAME || 'localhost',
    strava: {
      clientId,
      clientSecret,
      redirectUri,
      scope: process.env.STRAVA_SCOPE || 'activity:read',
    },
    cookies: {
      domain: process.env.COOKIE_DOMAIN,
      secure: process.env.COOKIE_SECURE === 'true' || isProduction,
      sameSite: (process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 'lax',
    },
    successRedirect: process.env.SUCCESS_REDIRECT || '/',
    errorRedirect: process.env.ERROR_REDIRECT || '/',
  };
};

export default getConfig;
