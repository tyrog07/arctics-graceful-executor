import { executeBatch } from '../batch';
import { safeExecute } from '../../lib/SafeExecute';

jest.mock('../../lib/SafeExecute', () => ({
  safeExecute: jest.fn(),
}));

describe('executeBatch', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls and implementations before each test
  });

  it('should execute multiple functions in parallel', async () => {
    (safeExecute as jest.Mock).mockResolvedValueOnce([null, 1]);
    (safeExecute as jest.Mock).mockResolvedValueOnce([null, 2]);
    (safeExecute as jest.Mock).mockResolvedValueOnce([null, 3]);

    const fn1 = async () => 1;
    const fn2 = async () => 2;
    const fn3 = async () => 3;

    const results = await executeBatch([fn1, fn2, fn3]);

    expect(results).toEqual([
      [null, 1],
      [null, 2],
      [null, 3],
    ]);
    expect(safeExecute).toHaveBeenCalledTimes(3);
  });

  it('should handle errors in batch execution', async () => {
    (safeExecute as jest.Mock).mockResolvedValueOnce([null, 1]);
    (safeExecute as jest.Mock).mockResolvedValueOnce([
      new Error('Batch error'),
      null,
    ]);
    (safeExecute as jest.Mock).mockResolvedValueOnce([null, 3]);

    const fn1 = async () => 1;
    const fn2 = async () => {
      throw new Error('Batch error');
    };
    const fn3 = async () => 3;

    const results = await executeBatch([fn1, fn2, fn3]);

    expect(results).toEqual([
      [null, 1],
      [expect.any(Error), null],
      [null, 3],
    ]);
    expect(safeExecute).toHaveBeenCalledTimes(3);
  });
});
