import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

/**
 * Activity type to subject mapping.
 */
const ACTIVITY_SUBJECTS: Record<string, string> = {
  Run: 'runner',
  Ride: 'cyclist',
  TrailRun: 'trail runner',
  Walk: 'walker',
  Hike: 'hiker',
  Swim: 'swimmer',
  VirtualRide: 'cyclist',
  VirtualRun: 'runner',
};

/**
 * Composes scene description from activity signals.
 *
 * Builds environment description based on activity type, elevation,
 * and time of day. Scene composition follows priority order:
 * base environment → terrain → lighting → atmosphere.
 *
 * Scene composition priority:
 * 1. Base environment (from activity type)
 * 2. Terrain features (from elevation)
 * 3. Weather elements (if applicable)
 * 4. Lighting (from time of day)
 * 5. Atmosphere (from mood)
 *
 * @param {StravaActivitySignals} signals - Activity signals to compose scene from
 * @returns {{ subject: string; scene: string }} Subject and scene description
 */
const composeScene = (signals: StravaActivitySignals): { subject: string; scene: string } => {
  // Determine subject from activity type
  const subject = ACTIVITY_SUBJECTS[signals.core.activityType] ?? 'athlete';

  // Build scene components
  const sceneParts: string[] = [];

  // Base environment
  const baseEnvironment = signals.core.activityType.includes('Virtual')
    ? 'indoor training space'
    : 'outdoor setting';
  sceneParts.push(baseEnvironment);

  // Terrain features
  if (signals.core.elevation === 'mountainous') {
    sceneParts.push('mountainous terrain');
  } else if (signals.core.elevation === 'rolling') {
    sceneParts.push('rolling hills');
  } else {
    sceneParts.push('flat terrain');
  }

  // Lighting from time of day
  if (signals.core.timeOfDay === 'morning') {
    sceneParts.push('soft morning light');
  } else if (signals.core.timeOfDay === 'day') {
    sceneParts.push('bright daylight');
  } else if (signals.core.timeOfDay === 'evening') {
    sceneParts.push('warm evening glow');
  } else if (signals.core.timeOfDay === 'night') {
    sceneParts.push('dark night atmosphere');
  }

  // Compose scene string
  const scene = sceneParts.join(', ');

  return { subject, scene };
};

export default composeScene;
