import { describe, test, expect } from 'bun:test';

import classifySubject from './classify-subject';
import { StravaActivitySignalsSubject } from '../types';

type Case = [string, string, StravaActivitySignalsSubject];

describe('classify-subject', () => {
  test.each<Case>([
    ['running activity classifies as runner', 'Run', 'runner'],
    ['cycling activity classifies as cyclist', 'Ride', 'cyclist'],
    ['trail running activity classifies as trail runner', 'TrailRun', 'trail runner'],
    ['walking activity classifies as walker', 'Walk', 'walker'],
    ['hiking activity classifies as hiker', 'Hike', 'hiker'],
    ['swimming activity classifies as swimmer', 'Swim', 'swimmer'],
    ['virtual cycling activity classifies as cyclist', 'VirtualRide', 'cyclist'],
    ['virtual running activity classifies as runner', 'VirtualRun', 'runner'],
    ['unknown activity type defaults to athlete', 'Yoga', 'athlete'],
    ['weight training defaults to athlete', 'WeightTraining', 'athlete'],
  ])('%#. %s', (_name, activityType, expected) => {
    const result = classifySubject(activityType);

    expect(result).toBe(expected);
  });
});
