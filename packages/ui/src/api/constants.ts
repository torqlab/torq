export const ENDPOINTS = {
  STRAVA_AUTH_STATUS: '/strava/auth/status',
  STRAVA_AUTH: '/strava/auth',
  STRAVA_ACTIVITIES: '/strava/activities',

  /**
   * Builds endpoint for fetching specific activity by ID.
   * @param {string} id - Activity ID.
   * @returns {string} Endpoint URL.
   */
  STRAVA_ACTIVITY: (id: string) => `/strava/activity/${id}`,

  /**
   * Builds endpoint for fetching activity signals by activity ID.
   * @param {string} id - Activity ID.
   * @returns {string} Endpoint URL.
   */
  STRAVA_ACTIVITY_SIGNALS: (id: string) => `/strava/activities/${id}/signals`,
};
