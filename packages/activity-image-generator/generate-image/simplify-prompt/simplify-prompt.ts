import { StravaActivityImagePrompt } from '../../types';

/**
 * Simplifies an image generation prompt for retry attempts.
 *
 * Reduces prompt complexity by removing less essential elements.
 * First simplification removes scene details, keeping style, mood, and subject.
 * Second simplification keeps only style and basic subject.
 *
 * @param {StravaActivityImagePrompt} prompt - Original prompt to simplify
 * @param {number} retryLevel - Retry attempt level (1 or 2)
 * @returns {StravaActivityImagePrompt} Simplified prompt with reduced text
 *
 * @remarks
 * Simplification strategy:
 * - Level 1: Remove scene, keep style + mood + subject
 * - Level 2: Keep only style + basic subject
 * The text field is reassembled after simplification.
 *
 * @example
 * ```typescript
 * const simplified = simplifyPrompt(originalPrompt, 1);
 * ```
 */
const simplifyPrompt = (prompt: StravaActivityImagePrompt, retryLevel: number): StravaActivityImagePrompt => {
  if (retryLevel === 1) {
    const simplifiedText = `${prompt.style} style, ${prompt.mood} mood, ${prompt.subject}`;
    return {
      ...prompt,
      scene: '',
      text: simplifiedText.length <= 400 ? simplifiedText : simplifiedText.substring(0, 400),
    };
  } else {
    const basicSubject = prompt.subject.split(',')[0]?.trim() ?? prompt.subject;
    const simplifiedText = `${prompt.style} style, ${basicSubject}`;
    return {
      ...prompt,
      mood: '',
      scene: '',
      text: simplifiedText.length <= 400 ? simplifiedText : simplifiedText.substring(0, 400),
    };
  }
};

export default simplifyPrompt;
