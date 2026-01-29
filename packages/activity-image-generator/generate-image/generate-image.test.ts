import { describe, test, expect, beforeEach, afterEach, mock } from 'bun:test';
import generateImage from './generate-image';
import { StravaActivityImagePrompt } from '../types';

type Case = [
  string,
  {
    prompt: StravaActivityImagePrompt;
    dialKey: string;
    fetchResponses: any[];
    shouldThrow: boolean;
    expectedError?: string;
    expectedUsedFallback: boolean;
    expectedRetriesPerformed: number;
  }
];

describe('generate-image', () => {
  const testState = { originalEnv: process.env.DIAL_KEY, originalFetch: global.fetch };

  beforeEach(() => {
    testState.originalEnv = process.env.DIAL_KEY;
    testState.originalFetch = global.fetch;
  });

  afterEach(() => {
    if (testState.originalEnv !== undefined) {
      process.env.DIAL_KEY = testState.originalEnv;
    } else {
      delete process.env.DIAL_KEY;
    }
    global.fetch = testState.originalFetch;
  });

  test.each<Case>([
    [
      'throws error when DIAL_KEY is not set',
      {
        prompt: {
          style: 'cartoon',
          mood: 'energetic',
          subject: 'runner',
          scene: 'park',
          text: 'cartoon style, runner, energetic mood, park',
        },
        dialKey: '',
        fetchResponses: [],
        shouldThrow: true,
        expectedError: 'DIAL_KEY is not set',
        expectedUsedFallback: false,
        expectedRetriesPerformed: 0,
      },
    ],
    [
      'successfully generates image on first attempt',
      {
        prompt: {
          style: 'cartoon',
          mood: 'energetic',
          subject: 'runner',
          scene: 'park',
          text: 'cartoon style, runner, energetic mood, park',
        },
        dialKey: 'test-key',
        fetchResponses: [
          {
            choices: [
              {
                message: {
                  custom_content: {
                    attachments: [
                      {
                        type: 'image/png',
                        url: 'files/test/image.png',
                      },
                    ],
                  },
                },
              },
            ],
          },
        ],
        shouldThrow: false,
        expectedUsedFallback: false,
        expectedRetriesPerformed: 0,
      },
    ],
    [
      'retries with simplified prompt on failure',
      {
        prompt: {
          style: 'cartoon',
          mood: 'energetic',
          subject: 'runner',
          scene: 'park',
          text: 'cartoon style, runner, energetic mood, park',
        },
        dialKey: 'test-key',
        fetchResponses: [
          {
            error: { message: 'First attempt failed' },
          },
          {
            choices: [
              {
                message: {
                  custom_content: {
                    attachments: [
                      {
                        type: 'image/png',
                        url: 'files/test/image2.png',
                      },
                    ],
                  },
                },
              },
            ],
          },
        ],
        shouldThrow: false,
        expectedUsedFallback: false,
        expectedRetriesPerformed: 0,
      },
    ],
    [
      'uses fallback after max retries',
      {
        prompt: {
          style: 'cartoon',
          mood: 'energetic',
          subject: 'runner',
          scene: 'park',
          text: 'cartoon style, runner, energetic mood, park',
        },
        dialKey: 'test-key',
        fetchResponses: [
          {
            error: { message: 'First attempt failed' },
          },
          {
            error: { message: 'Second attempt failed' },
          },
          {
            error: { message: 'Third attempt failed' },
          },
          {
            choices: [
              {
                message: {
                  custom_content: {
                    attachments: [
                      {
                        type: 'image/png',
                        url: 'files/test/fallback.png',
                      },
                    ],
                  },
                },
              },
            ],
          },
        ],
        shouldThrow: false,
        expectedUsedFallback: true,
        expectedRetriesPerformed: 2,
      },
    ],
  ])(
    '%#. %s',
    async (
      _name,
      {
        prompt,
        dialKey,
        fetchResponses,
        shouldThrow,
        expectedError,
        expectedUsedFallback,
        expectedRetriesPerformed,
      }
    ) => {
      if (dialKey) {
        process.env.DIAL_KEY = dialKey;
      } else {
        delete process.env.DIAL_KEY;
      }

      let callCount = 0;
      global.fetch = mock(() => {
        const response = fetchResponses[callCount] ?? fetchResponses[fetchResponses.length - 1];
        callCount++;
        return Promise.resolve({
          json: async () => response,
        } as Response);
      });

      if (shouldThrow) {
        await expect(generateImage({ prompt })).rejects.toThrow(expectedError);
      } else {
        const result = await generateImage({ prompt });
        expect(result.usedFallback).toBe(expectedUsedFallback);
        expect(result.retriesPerformed).toBe(expectedRetriesPerformed);
        expect(result.imageUrl).toBeTruthy();
        expect(typeof result.imageUrl).toBe('string');
      }
    }
  );

  test('throws error when prompt text exceeds 400 characters', async () => {
    process.env.DIAL_KEY = 'test-key';

    const longPrompt: StravaActivityImagePrompt = {
      style: 'cartoon',
      mood: 'energetic',
      subject: 'runner',
      scene: 'park',
      text: 'a'.repeat(401),
    };

    await expect(generateImage({ prompt: longPrompt })).rejects.toThrow('exceeds 400 character limit');
  });
});
