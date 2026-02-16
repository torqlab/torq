import { describe, test, expect } from 'bun:test';

import { Input } from './types';
import classifyStyle from './classify-style';
import { StravaActivitySignalsStyle } from '../types';

type Case = [string, Input, StravaActivitySignalsStyle];

describe('classify-style', () => {
  test.each<Case>([
    [
      'recovery tag selects minimal style',
      {
        activityType: 'Run',
        intensity: 'medium',
        elevation: 'flat',
        tags: ['recovery'],
      },
      'minimal',
    ],
    [
      'mountainous elevation selects illustrated style',
      {
        activityType: 'Run',
        intensity: 'medium',
        elevation: 'mountainous',
        tags: [],
      },
      'illustrated',
    ],
    [
      'high intensity Run selects illustrated style',
      {
        activityType: 'Run',
        intensity: 'high',
        elevation: 'flat',
        tags: [],
      },
      'illustrated',
    ],
    [
      'default selects cartoon style',
      {
        activityType: 'Swim',
        intensity: 'medium',
        elevation: 'flat',
        tags: [],
      },
      'cartoon',
    ],
    [
      'easy tag selects minimal style',
      {
        activityType: 'Run',
        intensity: 'low',
        elevation: 'flat',
        tags: ['easy'],
      },
      'minimal',
    ],
    [
      'high intensity Ride selects illustrated style',
      {
        activityType: 'Ride',
        intensity: 'high',
        elevation: 'flat',
        tags: [],
      },
      'illustrated',
    ],
    [
      'high intensity TrailRun selects illustrated style',
      {
        activityType: 'TrailRun',
        intensity: 'high',
        elevation: 'flat',
        tags: [],
      },
      'illustrated',
    ],
  ])('%#. %s', (_name, signals, expected) => {
    const result = classifyStyle(signals);

    expect(result).toBe(expected);
  });
});
