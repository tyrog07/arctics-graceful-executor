import {
  configureSafeExecute,
  safeExecute,
  safeExecuteBatch,
} from '../SafeExecute';

describe('safeExecute', () => {
  beforeEach(() => {
    // Reset global configuration before each test
    configureSafeExecute({
      errorHandler: (error) =>
        console.error('Global SafeExecute Error:', error),
      defaultValue: null,
    });
  });

  it('should execute a synchronous function successfully', async () => {
    const fn = () => 42;
    const [error, result] = await safeExecute(fn);

    expect(error).toBeNull();
    expect(result).toBe(42);
  });

  it('should execute an asynchronous function successfully', async () => {
    const fn = async () => 'async result';
    const [error, result] = await safeExecute(fn);

    expect(error).toBeNull();
    expect(result).toBe('async result');
  });

  it('should handle errors in a synchronous function', async () => {
    const fn = () => {
      throw new Error('Test error');
    };
    const [error, result] = await safeExecute(fn, { defaultValue: 'default' });

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe('Test error');
    expect(result).toBe('default');
  });

  it('should handle errors in an asynchronous function', async () => {
    const fn = async () => {
      throw new Error('Async error');
    };
    const [error, result] = await safeExecute(fn, { defaultValue: 'default' });

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe('Async error');
    expect(result).toBe('default');
  });

  it('should call the custom error handler if provided', async () => {
    const errorHandler = jest.fn();
    const fn = () => {
      throw new Error('Custom handler error');
    };

    await safeExecute(fn, { errorHandler });

    expect(errorHandler).toHaveBeenCalledTimes(1);
    expect(errorHandler).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should call the global error handler if no custom handler is provided', async () => {
    const globalErrorHandler = jest.fn();
    configureSafeExecute({ errorHandler: globalErrorHandler });

    const fn = () => {
      throw new Error('Global handler error');
    };

    await safeExecute(fn);

    expect(globalErrorHandler).toHaveBeenCalledTimes(1);
    expect(globalErrorHandler).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should call the finally callback after execution', async () => {
    const finallyCallback = jest.fn();
    const fn = () => 42;

    await safeExecute(fn, { finally: finallyCallback });

    expect(finallyCallback).toHaveBeenCalledTimes(1);
  });

  it('should call the finally callback even if an error occurs', async () => {
    const finallyCallback = jest.fn();
    const fn = () => {
      throw new Error('Error with finally');
    };

    await safeExecute(fn, { finally: finallyCallback });

    expect(finallyCallback).toHaveBeenCalledTimes(1);
  });

  it('should retry the function if retries are configured', async () => {
    const fn = jest
      .fn()
      .mockImplementationOnce(() => {
        throw new Error('Retry error');
      })
      .mockImplementationOnce(() => 42);

    const [error, result] = await safeExecute(fn, { retries: 1 });

    expect(fn).toHaveBeenCalledTimes(2);
    expect(error).toBeNull();
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
    const [error, result] = await safeExecute(fn, {
      retries: 1,
      retryDelay: 100,
    });

    const elapsed = Date.now() - start;

    expect(fn).toHaveBeenCalledTimes(2);
    expect(error).toBeNull();
    expect(result).toBe(42);
    expect(elapsed).toBeGreaterThanOrEqual(100);
  });

  it('should timeout if the function takes too long', async () => {
    const fn = async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return 42;
    };

    const [error, result] = await safeExecute(fn, { timeout: 100 });

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe('Operation timed out');
    expect(result).toBeNull();
  });

  it('should log execution if logging is enabled', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const fn = () => 42;

    await safeExecute(fn, { logging: true });

    expect(consoleLogSpy).toHaveBeenCalledWith('Execution succeeded:', 42);
    consoleLogSpy.mockRestore();
  });

  it('should log errors if logging is enabled', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const fn = () => {
      throw new Error('Logging error');
    };

    await safeExecute(fn, { logging: true });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Execution failed:',
      expect.any(Error),
    );
    consoleErrorSpy.mockRestore();
  });

  it('should handle context and pass it to the error handler', async () => {
    const errorHandler = jest.fn();
    const fn = () => {
      throw new Error('Context error');
    };

    await safeExecute(fn, {
      context: { userId: 123 },
      errorHandler: (error) => errorHandler(error, { userId: 123 }),
    });

    expect(errorHandler).toHaveBeenCalledWith(expect.any(Error), {
      userId: 123,
    });
  });
});

describe('safeExecuteBatch', () => {
  it('should execute multiple functions in parallel', async () => {
    const fn1 = async () => 1;
    const fn2 = async () => 2;
    const fn3 = async () => 3;

    const results = await safeExecuteBatch([fn1, fn2, fn3]);

    expect(results).toEqual([
      [null, 1],
      [null, 2],
      [null, 3],
    ]);
  });

  it('should handle errors in batch execution', async () => {
    const fn1 = async () => 1;
    const fn2 = async () => {
      throw new Error('Batch error');
    };
    const fn3 = async () => 3;

    const results = await safeExecuteBatch([fn1, fn2, fn3]);

    expect(results).toEqual([
      [null, 1],
      [expect.any(Error), null],
      [null, 3],
    ]);
  });
});
