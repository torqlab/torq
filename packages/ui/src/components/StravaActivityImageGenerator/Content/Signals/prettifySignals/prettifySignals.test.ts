import { describe, test, expect } from 'bun:test';

import prettifySignals from './prettifySignals';
import { StravaActivitySignals } from '@pace/get-strava-activity-signals';
import { Output } from './types';

type Case = [string, StravaActivitySignals, Output];

describe('prettifySignals', () => {
  describe('formats single field values', () => {
    test.each<Case>([
      [
        'formats activity type field',
        {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'morning',
          },
          derived: {
            mood: 'focused',
            style: 'realistic',
            subject: 'runner',
            terrain: 'paved road',
            environment: 'outdoor',
            atmosphere: 'bright',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'medium'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'morning'],
          ['Mood', 'focused'],
          ['Style', 'realistic'],
          ['Subject', 'runner'],
          ['Terrain', 'paved road'],
          ['Environment', 'outdoor'],
          ['Atmosphere', 'bright'],
        ],
      ],
      [
        'formats mountain bike ride',
        {
          core: {
            activityType: 'MountainBikeRide',
            intensity: 'high',
            elevation: 'mountainous',
            timeOfDay: 'afternoon',
          },
          derived: {
            mood: 'intense',
            style: 'illustrated',
            subject: 'athlete',
            terrain: 'mountainous terrain',
            environment: 'outdoor training space',
            atmosphere: 'dramatic lighting',
          },
        },
        [
          ['Activity Type', 'MountainBikeRide'],
          ['Intensity', 'high'],
          ['Elevation', 'mountainous'],
          ['Time Of Day', 'afternoon'],
          ['Mood', 'intense'],
          ['Style', 'illustrated'],
          ['Subject', 'athlete'],
          ['Terrain', 'mountainous terrain'],
          ['Environment', 'outdoor training space'],
          ['Atmosphere', 'dramatic lighting'],
        ],
      ],
    ])('%#. %s', (_name: string, input: StravaActivitySignals, expected: Output) => {
      const result = prettifySignals(input);
      expect(result).toStrictEqual(expected);
    });
  });

  describe('formats array field values', () => {
    test.each<Case>([
      [
        'joins single tag into string',
        {
          core: {
            activityType: 'Run',
            intensity: 'low',
            elevation: 'flat',
            timeOfDay: 'morning',
            tags: ['recovery'],
          },
          derived: {
            mood: 'calm',
            style: 'minimalist',
            subject: 'runner',
            terrain: 'paved road',
            environment: 'outdoor',
            atmosphere: 'soft light',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'low'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'morning'],
          ['Tags', 'recovery'],
          ['Mood', 'calm'],
          ['Style', 'minimalist'],
          ['Subject', 'runner'],
          ['Terrain', 'paved road'],
          ['Environment', 'outdoor'],
          ['Atmosphere', 'soft light'],
        ],
      ],
      [
        'joins multiple tags with comma separator',
        {
          core: {
            activityType: 'Run',
            intensity: 'high',
            elevation: 'hilly',
            timeOfDay: 'evening',
            tags: ['race', 'personal best', 'competition'],
          },
          derived: {
            mood: 'intense',
            style: 'dynamic',
            subject: 'runner',
            terrain: 'rolling hills',
            environment: 'outdoor',
            atmosphere: 'golden hour',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'high'],
          ['Elevation', 'hilly'],
          ['Time Of Day', 'evening'],
          ['Tags', 'race, personal best, competition'],
          ['Mood', 'intense'],
          ['Style', 'dynamic'],
          ['Subject', 'runner'],
          ['Terrain', 'rolling hills'],
          ['Environment', 'outdoor'],
          ['Atmosphere', 'golden hour'],
        ],
      ],
      [
        'joins single brand into string',
        {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'morning',
            brands: ['Nike'],
          },
          derived: {
            mood: 'focused',
            style: 'modern',
            subject: 'runner',
            terrain: 'paved road',
            environment: 'outdoor',
            atmosphere: 'bright',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'medium'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'morning'],
          ['Brands', 'Nike'],
          ['Mood', 'focused'],
          ['Style', 'modern'],
          ['Subject', 'runner'],
          ['Terrain', 'paved road'],
          ['Environment', 'outdoor'],
          ['Atmosphere', 'bright'],
        ],
      ],
      [
        'joins multiple brands with comma separator',
        {
          core: {
            activityType: 'Ride',
            intensity: 'high',
            elevation: 'mountainous',
            timeOfDay: 'afternoon',
            brands: ['Garmin', 'Specialized', 'Shimano'],
          },
          derived: {
            mood: 'focused',
            style: 'technical',
            subject: 'cyclist',
            terrain: 'mountain trail',
            environment: 'outdoor',
            atmosphere: 'clear daylight',
          },
        },
        [
          ['Activity Type', 'Ride'],
          ['Intensity', 'high'],
          ['Elevation', 'mountainous'],
          ['Time Of Day', 'afternoon'],
          ['Brands', 'Garmin, Specialized, Shimano'],
          ['Mood', 'focused'],
          ['Style', 'technical'],
          ['Subject', 'cyclist'],
          ['Terrain', 'mountain trail'],
          ['Environment', 'outdoor'],
          ['Atmosphere', 'clear daylight'],
        ],
      ],
      [
        'joins semantic context keywords',
        {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'morning',
            semanticContext: ['park', 'trail', 'nature'],
          },
          derived: {
            mood: 'calm',
            style: 'natural',
            subject: 'runner',
            terrain: 'forest trail',
            environment: 'outdoor',
            atmosphere: 'soft morning light',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'medium'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'morning'],
          ['Semantic Context', 'park, trail, nature'],
          ['Mood', 'calm'],
          ['Style', 'natural'],
          ['Subject', 'runner'],
          ['Terrain', 'forest trail'],
          ['Environment', 'outdoor'],
          ['Atmosphere', 'soft morning light'],
        ],
      ],
      [
        'includes all array fields together',
        {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'rolling',
            timeOfDay: 'morning',
            tags: ['training', 'long run'],
            brands: ['Garmin', 'Nike'],
            semanticContext: ['trail', 'forest'],
          },
          derived: {
            mood: 'focused',
            style: 'natural',
            subject: 'runner',
            terrain: 'forest trail',
            environment: 'outdoor',
            atmosphere: 'soft morning light',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'medium'],
          ['Elevation', 'rolling'],
          ['Time Of Day', 'morning'],
          ['Tags', 'training, long run'],
          ['Brands', 'Garmin, Nike'],
          ['Semantic Context', 'trail, forest'],
          ['Mood', 'focused'],
          ['Style', 'natural'],
          ['Subject', 'runner'],
          ['Terrain', 'forest trail'],
          ['Environment', 'outdoor'],
          ['Atmosphere', 'soft morning light'],
        ],
      ],
    ])('%#. %s', (_name: string, input: StravaActivitySignals, expected: Output) => {
      const result = prettifySignals(input);
      expect(result).toStrictEqual(expected);
    });
  });

  describe('filters out falsy values', () => {
    test.each<Case>([
      [
        'omits undefined tags field',
        {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'morning',
            tags: undefined,
          },
          derived: {
            mood: 'focused',
            style: 'minimalist',
            subject: 'runner',
            terrain: 'paved road',
            environment: 'outdoor',
            atmosphere: 'bright',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'medium'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'morning'],
          ['Mood', 'focused'],
          ['Style', 'minimalist'],
          ['Subject', 'runner'],
          ['Terrain', 'paved road'],
          ['Environment', 'outdoor'],
          ['Atmosphere', 'bright'],
        ],
      ],
      [
        'omits all undefined optional fields',
        {
          core: {
            activityType: 'Ride',
            intensity: 'low',
            elevation: 'flat',
            timeOfDay: 'afternoon',
            tags: undefined,
            brands: undefined,
            semanticContext: undefined,
          },
          derived: {
            mood: 'calm',
            style: 'simple',
            subject: 'cyclist',
            terrain: 'paved road',
            environment: 'outdoor',
            atmosphere: 'clear daylight',
          },
        },
        [
          ['Activity Type', 'Ride'],
          ['Intensity', 'low'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'afternoon'],
          ['Mood', 'calm'],
          ['Style', 'simple'],
          ['Subject', 'cyclist'],
          ['Terrain', 'paved road'],
          ['Environment', 'outdoor'],
          ['Atmosphere', 'clear daylight'],
        ],
      ],
      [
        'omits empty array for tags',
        {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'morning',
            tags: [],
          },
          derived: {
            mood: 'focused',
            style: 'minimalist',
            subject: 'runner',
            terrain: 'paved road',
            environment: 'outdoor',
            atmosphere: 'bright',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'medium'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'morning'],
          ['Mood', 'focused'],
          ['Style', 'minimalist'],
          ['Subject', 'runner'],
          ['Terrain', 'paved road'],
          ['Environment', 'outdoor'],
          ['Atmosphere', 'bright'],
        ],
      ],
      [
        'omits empty arrays for all optional fields',
        {
          core: {
            activityType: 'Swim',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'morning',
            tags: [],
            brands: [],
            semanticContext: [],
          },
          derived: {
            mood: 'calm',
            style: 'fluid',
            subject: 'swimmer',
            terrain: 'pool',
            environment: 'indoor',
            atmosphere: 'bright',
          },
        },
        [
          ['Activity Type', 'Swim'],
          ['Intensity', 'medium'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'morning'],
          ['Mood', 'calm'],
          ['Style', 'fluid'],
          ['Subject', 'swimmer'],
          ['Terrain', 'pool'],
          ['Environment', 'indoor'],
          ['Atmosphere', 'bright'],
        ],
      ],
    ])('%#. %s', (_name: string, input: StravaActivitySignals, expected: Output) => {
      const result = prettifySignals(input);
      expect(result).toStrictEqual(expected);
    });
  });

  describe('handles key formatting edge cases', () => {
    test.each<Case>([
      [
        'formats single-word keys correctly',
        {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'morning',
          },
          derived: {
            mood: 'focused',
            style: 'minimalist',
            subject: 'runner',
            terrain: 'paved',
            environment: 'outdoor',
            atmosphere: 'bright',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'medium'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'morning'],
          ['Mood', 'focused'],
          ['Style', 'minimalist'],
          ['Subject', 'runner'],
          ['Terrain', 'paved'],
          ['Environment', 'outdoor'],
          ['Atmosphere', 'bright'],
        ],
      ],
      [
        'formats multi-word camelCase keys correctly',
        {
          core: {
            activityType: 'TrailRun',
            intensity: 'high',
            elevation: 'mountainous',
            timeOfDay: 'afternoon',
            semanticContext: ['mountain', 'wilderness'],
          },
          derived: {
            mood: 'adventurous',
            style: 'rugged',
            subject: 'trail runner',
            terrain: 'mountain trail',
            environment: 'wilderness',
            atmosphere: 'dramatic',
          },
        },
        [
          ['Activity Type', 'TrailRun'],
          ['Intensity', 'high'],
          ['Elevation', 'mountainous'],
          ['Time Of Day', 'afternoon'],
          ['Semantic Context', 'mountain, wilderness'],
          ['Mood', 'adventurous'],
          ['Style', 'rugged'],
          ['Subject', 'trail runner'],
          ['Terrain', 'mountain trail'],
          ['Environment', 'wilderness'],
          ['Atmosphere', 'dramatic'],
        ],
      ],
    ])('%#. %s', (_name: string, input: StravaActivitySignals, expected: Output) => {
      const result = prettifySignals(input);
      expect(result).toStrictEqual(expected);
    });
  });

  describe('handles minimal required fields', () => {
    test.each<Case>([
      [
        'handles only required core and derived fields',
        {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'morning',
          },
          derived: {
            mood: 'focused',
            style: 'minimalist',
            subject: 'runner',
            terrain: 'paved road',
            environment: 'outdoor',
            atmosphere: 'bright',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'medium'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'morning'],
          ['Mood', 'focused'],
          ['Style', 'minimalist'],
          ['Subject', 'runner'],
          ['Terrain', 'paved road'],
          ['Environment', 'outdoor'],
          ['Atmosphere', 'bright'],
        ],
      ],
    ])('%#. %s', (_name: string, input: StravaActivitySignals, expected: Output) => {
      const result = prettifySignals(input);
      expect(result).toStrictEqual(expected);
    });
  });
});
