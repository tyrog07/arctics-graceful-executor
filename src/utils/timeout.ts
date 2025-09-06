export async function executeWithTimeout<T>(
  fn: () => T | Promise<T>,
  options: { timeout?: number } = {},
): Promise<T> {
  const { timeout } = options;

  if (!timeout) {
    return fn();
  }

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Operation timed out')), timeout),
  );

  return Promise.race([fn(), timeoutPromise]);
}
