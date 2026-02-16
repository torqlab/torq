import { StravaActivitySignalsEnvironment } from '../types';

/**
 * Extracts environment details.
 * @param {string} activityType - Strava activity type.
 * @returns {StravaActivityImageGeneraionPromptEnvironment} Activity environment details.
 * @internal
 */
const classifyEnvironment = (activityType?: string): StravaActivitySignalsEnvironment =>
  activityType?.includes('Virtual') ? 'indoor training space' : 'outdoor training space';

export default classifyEnvironment;
