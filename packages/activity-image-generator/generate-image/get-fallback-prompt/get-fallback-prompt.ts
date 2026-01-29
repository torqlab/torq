import { StravaActivityImagePrompt } from '../../types';
import { CONFIG } from '../constants';

/**
 * Generates a safe fallback prompt for image generation.
 *
 * Creates a minimal, safe prompt using abstract or minimal style when
 * all retry attempts have failed. Uses deterministic style selection based
 * on activity type hash to ensure consistency.
 *
 * @param {string} activityType - Activity type (e.g., 'Run', 'Ride')
 * @returns {StravaActivityImagePrompt} Safe fallback prompt with minimal/abstract style
 *
 * @remarks
 * Fallback prompts are designed to be:
 * - Safe and family-friendly
 * - Simple and generic
 * - Always valid and compliant with guardrails
 * Style selection is deterministic based on activity type.
 *
 * @example
 * ```typescript
 * const fallback = getFallbackPrompt('Run');
 * // Returns: { style: 'abstract', mood: 'energetic', ... }
 * ```
 */
const getFallbackPrompt = (activityType: string): StravaActivityImagePrompt => {
  const fallbackStyles = CONFIG.FALLBACK_STYLES;
  
  const styleIndex = (() => {
    const chars = Array.from(activityType);
    const hash = chars.reduce((acc, char) => {
      const charCode = char.charCodeAt(0);
      const newHash = ((acc << 5) - acc) + charCode;
      return newHash & newHash;
    }, 0);
    return Math.abs(hash) % fallbackStyles.length;
  })();
  
  const style = fallbackStyles[styleIndex] ?? 'abstract';
  
  const subject = 'fitness activity illustration';
  const mood = 'energetic';
  const scene = 'neutral background';
  
  const text = `${style} style, ${subject}, ${mood} mood, ${scene}`;
  
  return {
    style: style as 'minimal' | 'abstract',
    mood,
    subject,
    scene,
    text: text.length <= 400 ? text : text.substring(0, 400),
  };
};

export default getFallbackPrompt;
