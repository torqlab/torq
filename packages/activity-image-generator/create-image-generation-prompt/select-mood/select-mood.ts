import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

/**
 * Selects mood descriptor based on activity signals.
 *
 * Mood selection is deterministic and aligns with activity characteristics.
 * Priority: tags → intensity.
 *
 * Mood selection priority:
 * 1. Tag signals (recovery → calm, race → intense)
 * 2. Intensity level (low → calm, high → intense)
 *
 * @param {StravaActivitySignals} signals - Activity signals to base mood selection on
 * @returns {string} Mood descriptor (e.g., "calm", "intense", "focused")
 */
const selectMood = (signals: StravaActivitySignals): string => {
  const hasRecoveryTag = signals.core.tags?.includes('recovery');
  const hasRaceTag = signals.core.tags?.includes('race');
  const hasCommuteTag = signals.core.tags?.includes('commute');
  const hasWithKidTag = signals.core.tags?.includes('with kid');
  const isLowIntensity = signals.core.intensity === 'low';
  const isHighIntensity = signals.core.intensity === 'high';
  const isMediumIntensity = signals.core.intensity === 'medium';

  // Priority 1: Tag-based mood
  if (hasRecoveryTag) {
    return 'calm';
  } else if (hasRaceTag) {
    return 'intense';
  } else if (hasCommuteTag) {
    return 'routine';
  } else if (hasWithKidTag) {
    return 'playful';
  } else if (isLowIntensity) {
    // Priority 3: Intensity-based mood
    return 'calm';
  } else if (isHighIntensity) {
    return 'intense';
  } else if (isMediumIntensity) {
    return 'focused';
  } else {
    // Default mood
    return 'focused';
  }
};

export default selectMood;
