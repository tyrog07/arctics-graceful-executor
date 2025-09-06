import { executeWithRetry } from '../retry';

describe('executeWithRetry', () => {
  it('should execute the function successfully without retries', async () => {
    const fn = jest.fn(() => 42);
    const result = await executeWithRetry(fn);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe(42);
  });

  it('should retry the function on failure', async () => {
    const fn = jest
      .fn()
      .mockImplementationOnce(() => {
        throw new Error('Retry error');
      })
      .mockImplementationOnce(() => 42);

    const result = await executeWithRetry(fn, { retries: 1 });

    expect(fn).toHaveBeenCalledTimes(2);
    expect(result).toBe(42);
  });

  it('should respect the retry delay', async () => {
    const fn = jest
      .fn()
      .mockImplementationOnce(() => {
        throw new Error('Retry error');
      })
      .mockImplementationOnce(() => 42);

    const start = Date.now();
    const result = await executeWithRetry(fn, { retries: 1, retryDelay: 100 });

    const elapsed = Date.now() - start;

    expect(fn).toHaveBeenCalledTimes(2);
    expect(result).toBe(42);
    expect(elapsed).toBeGreaterThanOrEqual(100);
  });

  it('should throw an error after exceeding retries', async () => {
    const fn = jest.fn(() => {
      throw new Error('Retry error');
    });

    await expect(executeWithRetry(fn, { retries: 2 })).rejects.toThrow(
      'Retry error',
    );
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
