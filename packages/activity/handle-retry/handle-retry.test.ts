import { describe, test, expect } from 'bun:test';
import handleRetry from './handle-retry';
import { ActivityError } from '../types';

type Case = [
  string,
  {
    fn: () => Promise<string>;
    maxRetries: number;
    initialBackoffMs?: number;
    shouldSucceed: boolean;
    expectedAttempts?: number;
    expectedError?: ActivityError;
  }
];

const createRetryableError = (): Error => {
  const error: ActivityError = {
    code: 'SERVER_ERROR',
    message: 'Server error',
    retryable: true,
  };
  return new Error(JSON.stringify(error));
};

const createNonRetryableError = (): Error => {
  const error: ActivityError = {
    code: 'INVALID_ID',
    message: 'Invalid ID',
    retryable: false,
  };
  return new Error(JSON.stringify(error));
};

describe('handle-retry', () => {
  test.each<Case>([
    [
      'succeeds on first attempt',
      {
        fn: async () => 'success',
        maxRetries: 3,
        shouldSucceed: true,
        expectedAttempts: 1,
      },
    ],
    [
      'retries and succeeds on second attempt',
      {
        fn: (() => {
          let attempts = 0;
          return async () => {
            attempts++;
            if (attempts === 1) {
              throw createRetryableError();
            }
            return 'success';
          };
        })(),
        maxRetries: 3,
        shouldSucceed: true,
        expectedAttempts: 2,
      },
    ],
    [
      'retries up to max retries then throws',
      {
        fn: () => {
          throw createRetryableError();
        },
        maxRetries: 2,
        shouldSucceed: false,
        expectedAttempts: 3,
      },
    ],
    [
      'does not retry non-retryable errors',
      {
        fn: () => {
          throw createNonRetryableError();
        },
        maxRetries: 3,
        shouldSucceed: false,
        expectedAttempts: 1,
      },
    ],
    [
      'succeeds after multiple retries',
      {
        fn: (() => {
          let attempts = 0;
          return async () => {
            attempts++;
            if (attempts < 3) {
              throw createRetryableError();
            }
            return 'success';
          };
        })(),
        maxRetries: 3,
        shouldSucceed: true,
        expectedAttempts: 3,
      },
    ],
  ])('%#. %s', async (_name, { fn, maxRetries, initialBackoffMs, shouldSucceed, expectedAttempts }) => {
    let attempts = 0;
    const wrappedFn = async () => {
      attempts++;
      return await fn();
    };

    if (shouldSucceed) {
      const result = await handleRetry(wrappedFn, maxRetries, initialBackoffMs);
      expect(result).toBe('success');
      expect(attempts).toBe(expectedAttempts);
    } else {
      await expect(async () => {
        await handleRetry(wrappedFn, maxRetries, initialBackoffMs);
      }).toThrow();
      expect(attempts).toBe(expectedAttempts);
    }
  });
});
