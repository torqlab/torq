import { describe, test, expect, beforeEach, afterEach, mock } from 'bun:test';
import askDialForImage from './ask-dial-for-image';

type Case = [
  string,
  {
    prompt: string;
    dialKey: string;
    responseBody: any;
    shouldThrow: boolean;
    expectedError?: string;
    expectedResult?: string;
  }
];

describe('ask-dial-for-image', () => {
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
      'throws error when DIAL_KEY environment variable is not set',
      {
        prompt: 'A cartoon runner',
        dialKey: '',
        responseBody: {},
        shouldThrow: true,
        expectedError: 'DIAL_KEY is not set',
      },
    ],
    [
      'returns image URL from successful response with relative URL',
      {
        prompt: 'A cartoon runner',
        dialKey: 'test-key',
        responseBody: {
          choices: [
            {
              message: {
                custom_content: {
                  attachments: [
                    {
                      type: 'image/png',
                      title: 'Image',
                      url: 'files/test/image.png',
                    },
                  ],
                },
              },
            },
          ],
        },
        shouldThrow: false,
        expectedResult: 'https://ai-proxy.lab.epam.com/v1/files/test/image.png',
      },
    ],
    [
      'returns image URL from successful response with absolute URL',
      {
        prompt: 'A cartoon runner',
        dialKey: 'test-key',
        responseBody: {
          choices: [
            {
              message: {
                custom_content: {
                  attachments: [
                    {
                      type: 'image/png',
                      title: 'Image',
                      url: 'https://example.com/image.png',
                    },
                  ],
                },
              },
            },
          ],
        },
        shouldThrow: false,
        expectedResult: 'https://example.com/image.png',
      },
    ],
    [
      'throws error when API returns error response',
      {
        prompt: 'A cartoon runner',
        dialKey: 'test-key',
        responseBody: {
          error: {
            message: 'Invalid request',
          },
        },
        shouldThrow: true,
        expectedError: 'Invalid request',
      },
    ],
    [
      'throws error when no image attachment in response',
      {
        prompt: 'A cartoon runner',
        dialKey: 'test-key',
        responseBody: {
          choices: [
            {
              message: {
                custom_content: {
                  attachments: [],
                },
              },
            },
          ],
        },
        shouldThrow: true,
        expectedError: 'No image attachment in DIAL response.',
      },
    ],
    [
      'throws error when image attachment has no URL',
      {
        prompt: 'A cartoon runner',
        dialKey: 'test-key',
        responseBody: {
          choices: [
            {
              message: {
                custom_content: {
                  attachments: [
                    {
                      type: 'image/png',
                      title: 'Image',
                    },
                  ],
                },
              },
            },
          ],
        },
        shouldThrow: true,
        expectedError: 'No image URL in DIAL response attachment.',
      },
    ],
  ])('%#. %s', async (_name, { prompt, dialKey, responseBody, shouldThrow, expectedError, expectedResult }) => {
    if (dialKey) {
      process.env.DIAL_KEY = dialKey;
    } else {
      delete process.env.DIAL_KEY;
    }

    global.fetch = mock(() =>
      Promise.resolve({
        json: async () => responseBody,
      } as Response)
    );

    if (shouldThrow) {
      await expect(askDialForImage(prompt)).rejects.toThrow(expectedError);
    } else {
      const result = await askDialForImage(prompt);
      expect(result).toBe(expectedResult);
    }
  });

  test('sends correct request to DIAL API', async () => {
    const originalKey = process.env.DIAL_KEY;
    process.env.DIAL_KEY = 'test-key';

    const mockFetch = mock(() =>
      Promise.resolve({
        json: async () => ({
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
        }),
      } as Response)
    );

    global.fetch = mockFetch;

    await askDialForImage('A cartoon runner');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[0]).toContain('dall-e-3');
    expect(callArgs[0]).toContain('chat/completions');
    expect(callArgs[1]?.method).toBe('POST');
    expect(callArgs[1]?.headers?.['Api-Key']).toBe('test-key');

    if (originalKey !== undefined) {
      process.env.DIAL_KEY = originalKey;
    } else {
      delete process.env.DIAL_KEY;
    }
  });
});
