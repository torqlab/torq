import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

/**
 * Selects visual style for image generation based on activity signals.
 *
 * Style selection is deterministic and based on activity characteristics.
 * Follows the style selection rules from the specification.
 *
 * Style selection rules (deterministic):
 * - High intensity + (Run|Ride|Trail Run) → illustrated
 * - Recovery/easy tags → minimal
 * - High elevation → illustrated
 * - Default → cartoon
 *
 * @param {StravaActivitySignals} signals - Activity signals to base style selection on
 * @returns {'cartoon' | 'minimal' | 'abstract' | 'illustrated'} Selected visual style
 */
const selectStyle = (
  signals: StravaActivitySignals,
): 'cartoon' | 'minimal' | 'abstract' | 'illustrated' => {
  const hasRecoveryTag = signals.core.tags?.includes('recovery') || signals.core.tags?.includes('easy');
  const isMountainous = signals.core.elevation === 'mountainous';
  const isHighIntensity = signals.core.intensity === 'high';
  const highIntensityActivities = ['Run', 'Ride', 'TrailRun'];
  const isHighIntensityActivity = highIntensityActivities.includes(signals.core.activityType);

  const result = (() => {
    if (hasRecoveryTag) {
      return 'minimal';
    } else if (isMountainous) {
      return 'illustrated';
    } else if (isHighIntensity && isHighIntensityActivity) {
      return 'illustrated';
    } else {
      return 'cartoon';
    }
  })();

  return result;
};

export default selectStyle;
