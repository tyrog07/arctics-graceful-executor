export async function executeWithRetry<T>(
  fn: () => T | Promise<T>,
  options: { retries?: number; retryDelay?: number } = {},
): Promise<T> {
  const { retries = 0, retryDelay = 0 } = options;
  let attempts = 0;

  while (attempts <= retries) {
    try {
      return await Promise.resolve(fn());
    } catch (error) {
      attempts++;
      if (attempts > retries) {
        throw error; // Throw the error after exceeding retries
      }
      if (retryDelay) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  // This line should never be reached, but TypeScript requires a return type
  throw new Error('Function execution reached an unexpected state.');
}
