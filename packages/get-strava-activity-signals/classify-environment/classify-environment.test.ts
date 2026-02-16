import { describe, test, expect } from 'bun:test';

import classifyEnvironment from './classify-environment';
import { StravaActivitySignalsEnvironment } from '../types';

type Case = [string, string | undefined, StravaActivitySignalsEnvironment];

describe('classify-environment', () => {
  test.each<Case>([
    ['virtual ride classifies as indoor training space', 'VirtualRide', 'indoor training space'],
    ['virtual run classifies as indoor training space', 'VirtualRun', 'indoor training space'],
    ['outdoor run classifies as outdoor training space', 'Run', 'outdoor training space'],
    ['trail run classifies as outdoor training space', 'TrailRun', 'outdoor training space'],
    ['cycling classifies as outdoor training space', 'Ride', 'outdoor training space'],
    [
      'undefined activity type classifies as outdoor training space',
      undefined,
      'outdoor training space',
    ],
  ])('%#. %s', (_name, activityType, expected) => {
    const result = classifyEnvironment(activityType);

    expect(result).toBe(expected);
  });
});
