import { RequestError } from '@octokit/request-error';

/**
 * Handles GitHub API rate limiting with exponential backoff
 */
export async function handleRateLimit(error: unknown): Promise<boolean> {
  if (error instanceof RequestError && error.status === 403) {
    const rateLimitRemaining = error.response?.headers['x-ratelimit-remaining'];
    const rateLimitReset = error.response?.headers['x-ratelimit-reset'];

    if (rateLimitRemaining === '0' && rateLimitReset) {
      const resetTime = parseInt(rateLimitReset) * 1000;
      const waitTime = resetTime - Date.now();

      if (waitTime > 0) {
        console.log(`Rate limit exceeded. Waiting ${waitTime}ms until reset.`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return true; // Retry after waiting
      }
    }
  }

  return false; // Not a rate limit error or can't handle it
}

/**
 * Implements exponential backoff for retries
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if it's a rate limit error
      const shouldRetry = await handleRateLimit(error);
      if (!shouldRetry && attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else if (!shouldRetry) {
        break;
      }
    }
  }

  throw lastError;
}

