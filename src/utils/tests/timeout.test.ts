import { executeWithTimeout } from '../timeout';

describe('executeWithTimeout', () => {
  it('should execute the function successfully within the timeout', async () => {
    const fn = async () => 42;
    const result = await executeWithTimeout(fn, { timeout: 100 });

    expect(result).toBe(42);
  });

  it('should throw a timeout error if the function takes too long', async () => {
    const fn = async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return 42;
    };

    await expect(executeWithTimeout(fn, { timeout: 100 })).rejects.toThrow(
      'Operation timed out',
    );
  });
});
