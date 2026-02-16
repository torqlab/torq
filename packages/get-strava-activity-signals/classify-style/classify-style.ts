import { StravaActivitySignalsStyle } from '../types';
import { HIGH_INTENSITY_ACTIVITIES } from './constants';
import { Input } from './types';

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
 * @param {StravaActivitySignals} signals - Activity signals to base style selection on.
 * @returns {StravaActivityImageGenerationPromptStyle} Selected visual style.
 */
const classifyStyle = ({
  tags,
  elevation,
  intensity,
  activityType,
}: Input): StravaActivitySignalsStyle => {
  const hasRecoveryTag = tags?.includes('recovery') || tags?.includes('easy');
  const isMountainous = elevation === 'mountainous';
  const isHighIntensity = intensity === 'high';
  const isHighIntensityActivity = activityType
    ? HIGH_INTENSITY_ACTIVITIES.includes(activityType)
    : false;

  if (hasRecoveryTag) {
    return 'minimal';
  } else if (isMountainous) {
    return 'illustrated';
  } else if (isHighIntensity && isHighIntensityActivity) {
    return 'illustrated';
  } else {
    return 'cartoon';
  }
};

export default classifyStyle;
