import { StravaActivitySignalsMood } from '../types';
import { Input } from './types';

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
 * @param {Input} input - Strava activity details to base mood selection on.
 * @returns {StravaActivitySignalsMood} Mood descriptor (e.g., "calm", "intense", "focused").
 */
const classifyMood = ({ tags, intensity }: Input): StravaActivitySignalsMood => {
  const hasRecoveryTag = tags?.includes('recovery');
  const hasRaceTag = tags?.includes('race');
  const hasCommuteTag = tags?.includes('commute');
  const hasWithKidTag = tags?.includes('with kid');
  const isLowIntensity = intensity === 'low';
  const isHighIntensity = intensity === 'high';
  const isMediumIntensity = intensity === 'medium';

  if (hasRecoveryTag) {
    return 'calm';
  } else if (hasRaceTag) {
    return 'intense';
  } else if (hasCommuteTag) {
    return 'routine';
  } else if (hasWithKidTag) {
    return 'playful';
  } else if (isLowIntensity) {
    return 'calm';
  } else if (isHighIntensity) {
    return 'intense';
  } else if (isMediumIntensity) {
    return 'focused';
  } else {
    return 'focused';
  }
};

export default classifyMood;
