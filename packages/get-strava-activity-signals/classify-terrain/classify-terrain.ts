import { StravaActivitySignalsElevation, StravaActivitySignalsTerrain } from '../types';

/**
 * Extracts terrain information from the elevation.
 * @param {StravaActivitySignalsElevation} elevation - Strava activity's elevation.
 * @returns {StravaActivityImageGeneraionPromptTerrain} Terrain information.
 * @internal
 */
const classifyTerrain = (
  elevation?: StravaActivitySignalsElevation,
): StravaActivitySignalsTerrain => {
  switch (elevation) {
    case 'mountainous': {
      return 'mountainous terrain';
    }
    case 'rolling': {
      return 'rolling hills';
    }
    default: {
      return 'flat terrain';
    }
  }
};

export default classifyTerrain;
