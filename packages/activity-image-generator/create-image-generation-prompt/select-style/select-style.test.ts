import { describe, test, expect } from 'bun:test';
import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

import selectStyle from './select-style';

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
    expectedStyle: 'cartoon' | 'minimal' | 'abstract' | 'illustrated';
  },
];

describe('select-style', () => {
  test.each<Case>([
    [
      'recovery tag selects minimal style',
      {
        signals: createSignals({
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: ['recovery'],
        }),
        expectedStyle: 'minimal',
      },
    ],
    [
      'mountainous elevation selects illustrated style',
      {
        signals: createSignals({
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'mountainous',
          timeOfDay: 'day',
          tags: [],
        }),
        expectedStyle: 'illustrated',
      },
    ],
    [
      'high intensity Run selects illustrated style',
      {
        signals: createSignals({
          activityType: 'Run',
          intensity: 'high',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: [],
        }),
        expectedStyle: 'illustrated',
      },
    ],
    [
      'default selects cartoon style',
      {
        signals: createSignals({
          activityType: 'Swim',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: [],
        }),
        expectedStyle: 'cartoon',
      },
    ],
  ])('%s', (_name, { signals, expectedStyle }) => {
    const result = selectStyle(signals);
    expect(result).toBe(expectedStyle);
  });
});
