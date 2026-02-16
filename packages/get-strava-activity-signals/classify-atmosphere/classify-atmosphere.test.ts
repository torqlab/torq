import { describe, test, expect } from 'bun:test';

import classifyAtmosphere from './classify-atmosphere';
import { StravaActivitySignalsAtmosphere, StravaActivitySignalsTimeOfDay } from '../types';

type Case = [string, StravaActivitySignalsTimeOfDay | undefined, StravaActivitySignalsAtmosphere];

describe('classify-atmosphere', () => {
  test.each<Case>([
    ['morning time of day selects soft morning light', 'morning', 'soft morning light'],
    ['daytime selects bright daylight', 'day', 'bright daylight'],
    ['evening selects warm evening glow', 'evening', 'warm evening glow'],
    ['night selects dark night atmosphere', 'night', 'dark night atmosphere'],
    ['undefined time of day defaults to soft neutral light', undefined, 'soft neutral light'],
  ])('%#. %s', (_name, timeOfDay, expected) => {
    const result = classifyAtmosphere(timeOfDay);

    expect(result).toBe(expected);
  });
});
