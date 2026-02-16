import { StravaActivitySignalsAtmosphere, StravaActivitySignalsTimeOfDay } from '../types';

/**
 * Extracts atmosphere details.
 * @param {StravaActivitySignalsTimeOfDay} timeOfDay - Strava activity's time of day.
 * @returns {StravaActivityImageGeneraionPromptEnvironment} Activity atmosphere details.
 * @internal
 */
const classifyAtmosphere = (
  timeOfDay?: StravaActivitySignalsTimeOfDay,
): StravaActivitySignalsAtmosphere => {
  switch (timeOfDay) {
    case 'morning': {
      return 'soft morning light';
    }
    case 'day': {
      return 'bright daylight';
    }
    case 'evening': {
      return 'warm evening glow';
    }
    case 'night': {
      return 'dark night atmosphere';
    }
    default: {
      return 'soft neutral light';
    }
  }
};

export default classifyAtmosphere;
