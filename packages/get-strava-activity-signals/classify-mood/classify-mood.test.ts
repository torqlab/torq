import { describe, test, expect } from 'bun:test';

import classifyMood from './classify-mood';
import { StravaActivitySignalsMood } from '../types';
import { Input } from './types';

type Case = [string, Input, StravaActivitySignalsMood];

describe('classify-mood', () => {
  test.each<Case>([
    [
      'recovery tag selects calm mood',
      {
        intensity: 'medium',
        tags: ['recovery'],
      },
      'calm',
    ],
    [
      'race tag selects intense mood',
      {
        intensity: 'medium',
        tags: ['race'],
      },
      'intense',
    ],
    [
      'low intensity selects calm mood',
      {
        intensity: 'low',
        tags: [],
      },
      'calm',
    ],
    [
      'high intensity selects intense mood',
      {
        intensity: 'high',
        tags: [],
      },
      'intense',
    ],
    [
      'medium intensity selects focused mood',
      {
        intensity: 'medium',
        tags: [],
      },
      'focused',
    ],
    [
      'commute tag selects routine mood',
      {
        intensity: 'medium',
        tags: ['commute'],
      },
      'routine',
    ],
    [
      'with kid tag selects playful mood',
      {
        intensity: 'medium',
        tags: ['with kid'],
      },
      'playful',
    ],
  ])('%#. %s', (_name, signals, expected) => {
    const result = classifyMood(signals);

    expect(result).toBe(expected);
  });
});
