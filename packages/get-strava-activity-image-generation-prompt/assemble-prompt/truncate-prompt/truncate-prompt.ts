import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

import { MAX_PROMPT_LENGTH } from '../../constants';
import {
  QUALITY_KEYWORDS,
  HUMAN_QUALITY_BY_STYLE,
  GENERAL_QUALITY,
} from '../constants';

/**
 * Truncates prompt while preserving quality keywords and core components.
 *
 * Priority order for truncation:
 * 1. Keep quality keywords (critical for image quality)
 * 2. Keep style, subject, human quality, mood (core components)
 * 3. Truncate scene details if needed
 *
 * @param {string} prompt - Prompt.
 * @param {StravaActivitySignals} signals - Strava activity signals.
 * @returns {string} Truncated prompt within character limit.
 */
const truncatePrompt = (
  prompt: string,
  signals: StravaActivitySignals,
): string => {
  if (prompt.length <= MAX_PROMPT_LENGTH) {
    return prompt;
  } else {
    const qualityKeywords = QUALITY_KEYWORDS[signals.style];
    const humanQuality = HUMAN_QUALITY_BY_STYLE[signals.style];
    const essentialPrompt = [
      qualityKeywords,
      `${signals.style} style`,
      `${signals.subject}${humanQuality}`,
      `${signals.mood} mood`,
    ].join('; ');
    const essentialLength = essentialPrompt.length + GENERAL_QUALITY.length;
    const remainingLength = MAX_PROMPT_LENGTH - essentialLength;

    if (remainingLength <= 0) {
      return `${essentialPrompt}${GENERAL_QUALITY}`;
    } else {
      const restPrompt = [
        `${signals.atmosphere} atmosphere`,
        signals.environment,
        signals.terrain,
        ...signals.brands ?? [],
        ...signals.semanticContext ?? [],
      ].join('; ');
      const truncatedRestPrompt =
        restPrompt.length > remainingLength
          ? restPrompt.substring(0, Math.max(0, remainingLength - 3)) + '...'
          : restPrompt;

      return `${essentialPrompt}; ${truncatedRestPrompt}; ${GENERAL_QUALITY}`;
    }
  }
};

export default truncatePrompt;
