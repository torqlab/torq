import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

import { StravaActivityImagePrompt } from '../types';
import validatePrompt from '../validate-prompt';
import selectStyle from './select-style';
import selectMood from './select-mood';
import composeScene from './compose-scene';
import assemblePrompt from './assemble-prompt';
import { DEFAULT_PROMPT } from './constants';
/**
 * Generates image generation prompt from activity signals.
 *
 * Main entry point for prompt generation. Creates a complete prompt
 * structure by selecting style, mood, and composing scene based on
 * activity signals. Validates the prompt and falls back to safe default
 * if validation fails.
 *
 * Prompt generation process:
 * 1. Select visual style (deterministic)
 * 2. Select mood descriptor
 * 3. Compose scene description
 * 4. Assemble final prompt text
 * 5. Validate prompt via Activity Guardrails
 * 6. Use fallback if validation fails
 *
 * @param {StravaActivitySignals} signals - Activity signals to generate prompt from
 * @returns {StravaActivityImagePrompt} Generated and validated prompt
 */
const createImageGenerationPrompt = (signals: StravaActivitySignals): StravaActivityImagePrompt => {
  // Select style
  const style = selectStyle(signals);

  // Select mood
  const mood = selectMood(signals);

  // Compose scene
  const { subject, scene } = composeScene(signals);

  // Assemble prompt
  const text = assemblePrompt({
    style,
    mood,
    subject,
    scene,
  });

  // Create prompt object
  const prompt: StravaActivityImagePrompt = {
    style,
    mood,
    subject,
    scene,
    text,
  };

  // Validate prompt
  const validation = validatePrompt(prompt);

  const result = (() => {
    if (!validation.valid) {
      if (validation.sanitized) {
        return validation.sanitized;
      } else {
        return DEFAULT_PROMPT;
      }
    } else {
      return prompt;
    }
  })();

  return result;
};

export default createImageGenerationPrompt;
