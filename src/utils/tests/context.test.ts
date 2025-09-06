import { handleContext } from '../context';

describe('handleContext', () => {
  it('should log context if provided', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    handleContext(new Error('Test error'), { context: { userId: 123 } });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error context:', {
      userId: 123,
    });
    consoleErrorSpy.mockRestore();
  });

  it('should not log context if none is provided', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    handleContext(new Error('Test error'), {});

    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      'Error context:',
      expect.anything(),
    );
    consoleErrorSpy.mockRestore();
  });
});
