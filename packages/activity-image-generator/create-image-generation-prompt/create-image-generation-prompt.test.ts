import { describe, test, expect } from 'bun:test';
import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

import generatePrompt from './create-image-generation-prompt';
import validatePrompt from '../validate-prompt';

/**
 * Creates a StravaActivitySignals object with default derived values.
 *
 * @param {StravaActivitySignals['core']} core - Core signal values.
 * @returns {StravaActivitySignals} Full signals object.
 */
const createSignals = (core: StravaActivitySignals['core']): StravaActivitySignals => ({
  core,
  derived: {
    mood: 'focused',
    style: 'cartoon',
    subject: 'runner',
    terrain: 'flat terrain',
    environment: 'outdoor training space',
    atmosphere: 'bright daylight',
  },
});

describe('generate-prompt', () => {
  test('generates valid prompt from signals', () => {
    const signals: StravaActivitySignals = createSignals({
      activityType: 'Run',
      intensity: 'medium',
      elevation: 'flat',
      timeOfDay: 'day',
      tags: [],
    });

    const prompt = generatePrompt(signals);

    expect(prompt.style).toBeDefined();
    expect(prompt.mood).toBeDefined();
    expect(prompt.subject).toBeDefined();
    expect(prompt.scene).toBeDefined();
    expect(prompt.text.length).toBeLessThanOrEqual(600);

    // Validate the prompt
    const validation = validatePrompt(prompt);
    expect(validation.valid).toBe(true);
  });

  test('generates prompt with recovery tag', () => {
    const signals: StravaActivitySignals = createSignals({
      activityType: 'Run',
      intensity: 'low',
      elevation: 'flat',
      timeOfDay: 'day',
      tags: ['recovery'],
    });

    const prompt = generatePrompt(signals);

    expect(prompt.style).toBe('minimal');
    expect(prompt.mood).toBe('calm');
  });

  test('generates prompt with high intensity', () => {
    const signals: StravaActivitySignals = createSignals({
      activityType: 'Run',
      intensity: 'high',
      elevation: 'flat',
      timeOfDay: 'day',
      tags: [],
    });

    const prompt = generatePrompt(signals);

    expect(prompt.style).toBe('illustrated');
    expect(prompt.mood).toBe('intense');
  });
});
