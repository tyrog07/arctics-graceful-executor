// src/index.ts
// This file contains the core logic for the safe-execute package.

import { executeWithRetry } from '../utils/retry';
import { executeWithTimeout } from '../utils/timeout';
import { logExecution } from '../utils/logging';
import { executeBatch } from '../utils/batch';
import { handleContext } from '../utils/context';

/**
 * Defines the options for the safeExecute function.
 */
export type SafeExecuteOptions = {
  /** A custom error handler for this specific call. */
  errorHandler?: (error: unknown) => void;
  /** A custom default return value if an error occurs. */
  defaultValue?: any;
  /** A function to be called after the operation, regardless of success or failure. */
  finally?: () => void;
  /** The number of times to retry the operation in case of failure. */
  retries?: number;
  /** The delay between retries, in milliseconds. */
  retryDelay?: number;
  /** The maximum time allowed for the operation, in milliseconds. */
  timeout?: number;
  /** Whether to enable logging for this execution. */
  logging?: boolean;
  /** Custom context data to be used in the execution. */
  context?: Record<string, any>;
};

/**
 * Global configuration for the safeExecute utility.
 */
let globalConfig = {
  /** The default global error handler. */
  errorHandler: (error: unknown) => {
    console.error('Global SafeExecute Error:', error);
  },
  /** The default global return value. */
  defaultValue: null,
};

/**
 * Configures the global behavior of safeExecute.
 * This can be used to set a project-wide error handler or default return value.
 * @param config The partial configuration object to apply globally.
 */
export function configureSafeExecute(config: Partial<typeof globalConfig>) {
  globalConfig = { ...globalConfig, ...config };
}

/**
 * Safely executes a function, catching any errors and providing a fallback.
 * This function returns a tuple of `[error, result]`, allowing for clear destructuring.
 * @param fn The function to execute. This can be async or synchronous.
 * @param options Optional configuration for the specific execution, which overrides the global settings.
 * @returns A tuple where the first element is the error (or null) and the second is the result (or the default value).
 */
export async function safeExecute<T>(
  fn: () => T | Promise<T>,
  options?: SafeExecuteOptions,
): Promise<[unknown, T | any]> {
  // Merge global and local options, with local options taking precedence.
  const mergedOptions = {
    ...globalConfig,
    ...options,
  };

  try {
    // Apply timeout and retry logic
    const result = await executeWithTimeout(
      () => executeWithRetry(fn, mergedOptions),
      mergedOptions,
    );

    // Log successful execution
    if (mergedOptions.logging) {
      logExecution(null, result);
    }

    return [null, result];
  } catch (error) {
    // Handle context and log errors
    handleContext(error, mergedOptions);
    if (mergedOptions.logging) {
      logExecution(error);
    }

    // Call the specific or global error handler if one is provided.
    if (mergedOptions.errorHandler) {
      mergedOptions.errorHandler(error);
    }
    // Return the error and the specified default value.
    return [error, mergedOptions.defaultValue];
  } finally {
    // The finally callback always runs, perfect for cleanup logic.
    if (mergedOptions.finally) {
      mergedOptions.finally();
    }
  }
}

/**
 * Executes multiple functions in parallel and handles their results/errors collectively.
 * @param fns Array of functions to execute.
 * @param options Configuration options for each execution.
 * @returns Array of [error, result] tuples.
 */
export async function safeExecuteBatch<T>(
  fns: Array<() => T | Promise<T>>,
  options?: SafeExecuteOptions,
): Promise<Array<[unknown, T | any]>> {
  return executeBatch(fns, options);
}
