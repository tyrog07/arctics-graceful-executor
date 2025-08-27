import { configureSafeExecute, safeExecute } from '../index';

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
});
