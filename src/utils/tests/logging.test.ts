import { logExecution } from '../logging';

describe('logExecution', () => {
  it('should log success messages', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    logExecution(null, 42);

    expect(consoleLogSpy).toHaveBeenCalledWith('Execution succeeded:', 42);
    consoleLogSpy.mockRestore();
  });

  it('should log error messages', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    logExecution(new Error('Test error'));

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Execution failed:',
      expect.any(Error),
    );
    consoleErrorSpy.mockRestore();
  });
});
