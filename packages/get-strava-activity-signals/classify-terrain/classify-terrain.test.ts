import { describe, test, expect } from 'bun:test';

import classifyTerrain from './classify-terrain';
import { StravaActivitySignalsElevation, StravaActivitySignalsTerrain } from '../types';

type Case = [string, StravaActivitySignalsElevation | undefined, StravaActivitySignalsTerrain];

describe('classify-terrain', () => {
  test.each<Case>([
    [
      'mountainous elevation classifies as mountainous terrain',
      'mountainous',
      'mountainous terrain',
    ],
    ['rolling elevation classifies as rolling hills', 'rolling', 'rolling hills'],
    ['flat elevation classifies as flat terrain', 'flat', 'flat terrain'],
    ['undefined elevation defaults to flat terrain', undefined, 'flat terrain'],
  ])('%#. %s', (_name, elevation, expected) => {
    const result = classifyTerrain(elevation);

    expect(result).toBe(expected);
  });
});
