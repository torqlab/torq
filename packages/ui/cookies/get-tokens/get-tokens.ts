import { COOKIE_NAMES } from '../../types';

/**
 * Extracts Strava OAuth tokens from request cookies.
 *
 * @param {Request} request - Request object to read cookies from
 * @returns {{ accessToken: string; refreshToken: string; expiresAt: number } | null} Tokens if found, null otherwise
 */
const getTokens = (
  request: Request
): { accessToken: string; refreshToken: string; expiresAt: number } | null => {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      acc[key] = decodeURIComponent(value);
    }
    return acc;
  }, {} as Record<string, string>);

  const accessToken = cookies[COOKIE_NAMES.ACCESS_TOKEN];
  const refreshToken = cookies[COOKIE_NAMES.REFRESH_TOKEN];
  const expiresAtStr = cookies[COOKIE_NAMES.TOKEN_EXPIRES_AT];

  if (!accessToken || !refreshToken || !expiresAtStr) {
    return null;
  }

  const expiresAt = Number.parseInt(expiresAtStr, 10);
  if (Number.isNaN(expiresAt)) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    expiresAt,
  };
};

export default getTokens;
