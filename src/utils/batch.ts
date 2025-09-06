import { safeExecute } from '../lib/SafeExecute';

export async function executeBatch<T>(
  fns: Array<() => T | Promise<T>>,
  options?: any,
): Promise<Array<[unknown, T | any]>> {
  return Promise.all(fns.map((fn) => safeExecute(fn, options)));
}
