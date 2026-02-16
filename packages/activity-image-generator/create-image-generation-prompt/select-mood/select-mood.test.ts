import { describe, test, expect } from 'bun:test';
import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

import selectMood from './select-mood';

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

type Case = [
  string,
  {
    signals: StravaActivitySignals;
    expectedMood: string;
  },
];

describe('select-mood', () => {
  test.each<Case>([
    [
      'recovery tag selects calm mood',
      {
        signals: createSignals({
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: ['recovery'],
        }),
        expectedMood: 'calm',
      },
    ],
    [
      'race tag selects intense mood',
      {
        signals: createSignals({
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: ['race'],
        }),
        expectedMood: 'intense',
      },
    ],
    [
      'low intensity selects calm mood',
      {
        signals: createSignals({
          activityType: 'Run',
          intensity: 'low',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: [],
        }),
        expectedMood: 'calm',
      },
    ],
    [
      'high intensity selects intense mood',
      {
        signals: createSignals({
          activityType: 'Run',
          intensity: 'high',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: [],
        }),
        expectedMood: 'intense',
      },
    ],
    [
      'medium intensity selects focused mood',
      {
        signals: createSignals({
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: [],
        }),
        expectedMood: 'focused',
      },
    ],
  ])('%s', (_name, { signals, expectedMood }) => {
    const result = selectMood(signals);
    expect(result).toBe(expectedMood);
  });
});
