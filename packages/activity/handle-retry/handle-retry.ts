import { ActivityError } from '../types';
import { INITIAL_BACKOFF_MS, MAX_BACKOFF_MS } from '../constants';

/**
 * Parses an Error object to extract ActivityError if present.
 *
 * Attempts to parse the error message as JSON to extract structured ActivityError.
 * Returns null if parsing fails or error doesn't contain ActivityError structure.
 *
 * @param {Error} error - Error object potentially containing ActivityError in message
 * @returns {ActivityError | null} ActivityError if successfully parsed, null otherwise
 * @internal
 */
const parseError = (error: Error): ActivityError | null => {
  try {
    return JSON.parse(error.message) as ActivityError;
  } catch {
    return null;
  }
};

/**
 * Implements retry logic with exponential backoff for async operations.
 *
 * Executes a function with automatic retries on failure. Uses exponential backoff
 * strategy (doubling delay on each retry) up to a maximum delay. Only retries
 * errors marked as retryable (ActivityError.retryable === true). Non-retryable
 * errors are immediately thrown without retry attempts.
 *
 * @template T - The return type of the function being retried
 * @param {() => Promise<T>} fn - Async function to execute and retry on failure
 * @param {number} maxRetries - Maximum number of retry attempts (total attempts = maxRetries + 1)
 * @param {number} [initialBackoffMs=1000] - Initial backoff delay in milliseconds (default: 1000ms)
 * @returns {Promise<T>} Promise resolving to the function's return value on success
 * @throws {Error} Throws the last error encountered if all retries are exhausted
 *
 * @example
 * ```typescript
 * const result = await handleRetry(
 *   () => fetchFromApi('123456', config),
 *   3, // max 3 retries
 *   1000 // start with 1 second delay
 * );
 * // Retry delays: 1s, 2s, 4s (capped at MAX_BACKOFF_MS)
 * ```
 */
const handleRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number,
  initialBackoffMs: number = INITIAL_BACKOFF_MS
): Promise<T> => {
  let lastError: Error;
  let backoffMs = initialBackoffMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const activityError = parseError(lastError);

      if (activityError !== null && activityError.retryable === false) {
        throw lastError;
      }

      if (attempt < maxRetries) {
        const delayMs = Math.min(backoffMs, MAX_BACKOFF_MS);
        await Bun.sleep(delayMs);
        backoffMs = backoffMs * 2;
      }
    }
  }

  throw lastError!;
};

export default handleRetry;
