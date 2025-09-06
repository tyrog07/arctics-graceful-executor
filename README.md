# @arctics/graceful-executor

<div align="center">

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/tyrog07/@arctics/graceful-executor/blob/HEAD/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@arctics/graceful-executor/latest.svg)](https://www.npmjs.com/package/@arctics/graceful-executor)
[![npm downloads](https://img.shields.io/npm/dm/@arctics/graceful-executor.svg)](https://www.npmjs.com/package/@arctics/graceful-executor)
[![Checks](https://github.com/tyrog07/arctics-graceful-executor/actions/workflows/test.yml/badge.svg)](https://github.com/tyrog07/arctics-graceful-executor/actions/workflows/test.yml)
[![Build](https://github.com/tyrog07/arctics-graceful-executor/actions/workflows/build.yml/badge.svg)](https://github.com/tyrog07/arctics-graceful-executor/actions/workflows/build.yml)
[![CI](https://github.com/tyrog07/arctics-graceful-executor/actions/workflows/CI.yml/badge.svg?branch=main)](https://github.com/tyrog07/arctics-graceful-executor/actions/workflows/CI.yml)
[![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=@arctics/graceful-executor&query=$.install.pretty&label=install%20size)](https://packagephobia.now.sh/result?p=@arctics/graceful-executor)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@arctics/graceful-executor)](https://bundlephobia.com/package/@arctics/graceful-executor@latest)
[![Known Vulnerabilities](https://snyk.io/test/npm/@arctics/graceful-executor/badge.svg)](https://snyk.io/test/npm/@arctics/graceful-executor)

</div>

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Examples](#examples)
6. [API Reference](#api-reference)
7. [Contributing](#contributing)
8. [License](#license)

## Introduction

Tired of writing repetitive try...catch blocks? 😫 `@arctics/graceful-executor` is a lightweight, zero-dependency TypeScript utility that simplifies error handling for both synchronous and asynchronous functions.

It provides a clean, consistent way to execute functions, returning a predictable `[error, result]` tuple that eliminates boilerplate code and makes your logic cleaner and more robust.

## Features

- **Centralized Error Handling**: Configure a global error handler and a default return value for your entire application.
- **Retries with Delay**: Automatically retry failed operations with configurable retry counts and delays.
- **Timeout Support**: Abort long-running operations with a configurable timeout.
- **Logging**: Enable detailed logs for successful executions, errors, and retries.
- **Batch Execution**: Execute multiple functions in parallel and handle their results collectively.
- **Per-Call Overrides**: Easily override global settings with specific options for individual function calls.
- **Built-in Finally**: Use the optional `finally` callback for guaranteed cleanup actions.
- **TypeScript-First**: Built with strong types to provide a safe and predictable development experience.
- **Universal**: Works seamlessly with both async and synchronous functions.

## Installation

```bash
npm install @arctics/graceful-executor
```

or

```bash
yarn add @arctics/graceful-executor
```

## Usage

### Importing the Library

The library supports both CommonJS and ES Modules:

- **CommonJS**:

  ```javascript
  const {
    safeExecute,
    configureSafeExecute,
  } = require('@arctics/graceful-executor');
  ```

- **ES Modules**:
  ```javascript
  import {
    safeExecute,
    configureSafeExecute,
  } from '@arctics/graceful-executor';
  ```

### Configuration

You can configure global behavior for `safeExecute` using `configureSafeExecute`. This allows you to set a global error handler and a default fallback value.

```javascript
import { configureSafeExecute } from '@arctics/graceful-executor';

configureSafeExecute({
  errorHandler: (error) => console.error('Global Error:', error),
  defaultValue: 'default value',
});
```

## Examples

### Synchronous Example

```javascript
import { safeExecute } from '@arctics/graceful-executor';

function syncFunction() {
  if (Math.random() > 0.5) {
    throw new Error('Random sync error');
  }
  return 'Sync success';
}

const [error, result] = safeExecute(syncFunction);

if (error) {
  console.error('Sync Error:', error.message);
} else {
  console.log('Sync Result:', result);
}
```

### Asynchronous Example

```javascript
import { safeExecute } from '@arctics/graceful-executor';

async function asyncFunction() {
  if (Math.random() > 0.5) {
    throw new Error('Random async error');
  }
  return 'Async success';
}

(async () => {
  const [error, result] = await safeExecute(asyncFunction);

  if (error) {
    console.error('Async Error:', error.message);
  } else {
    console.log('Async Result:', result);
  }
})();
```

### Retry Logic

```javascript
import { safeExecute } from '@arctics/graceful-executor';

let attempt = 0;
function retryFunction() {
  attempt++;
  if (attempt < 3) {
    throw new Error('Retry error');
  }
  return 'Success after retries';
}

const [error, result] = await safeExecute(retryFunction, {
  retries: 2,
  retryDelay: 1000, // 1 second delay between retries
});

console.log('Error:', error);
console.log('Result:', result);
```

### Timeout Support

```javascript
import { safeExecute } from '@arctics/graceful-executor';

async function longRunningFunction() {
  await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate a 5-second delay
  return 'Completed';
}

const [error, result] = await safeExecute(longRunningFunction, {
  timeout: 3000, // 3-second timeout
});

console.log('Error:', error); // Logs timeout error
console.log('Result:', result); // Logs null
```

### Logging

```javascript
import { safeExecute } from '@arctics/graceful-executor';

function exampleFunction() {
  return 'Logging example success';
}

const [error, result] = await safeExecute(exampleFunction, {
  logging: true, // Enable logging
});
```

### Batch Execution

```javascript
import { safeExecuteBatch } from '@arctics/graceful-executor';

async function task1() {
  return 'Task 1 completed';
}

async function task2() {
  throw new Error('Task 2 failed');
}

async function task3() {
  return 'Task 3 completed';
}

const results = await safeExecuteBatch([task1, task2, task3]);

console.log(results);
// Output:
// [
//   [null, 'Task 1 completed'],
//   [Error: Task 2 failed, null],
//   [null, 'Task 3 completed']
// ]
```

## API Reference

### `safeExecute(fn, options?)`

Safely executes a function and returns a tuple `[error, result]`.

- **Parameters**:
  - `fn`: The function to execute (can be synchronous or asynchronous).
  - `options` (optional): An object with the following properties:
    - `errorHandler`: A custom error handler for this specific call.
    - `defaultValue`: A fallback value to return if an error occurs.
    - `finally`: A callback function to execute after the operation.
    - `retries`: Number of retry attempts if the function fails.
    - `retryDelay`: Delay (in milliseconds) between retries.
    - `timeout`: Maximum time (in milliseconds) to wait for the function to complete.
    - `logging`: Enable logging for the execution process.
    - `context`: Additional metadata to pass to the error handler.

- **Returns**: A tuple `[error, result]`.

### `safeExecuteBatch(fns, options?)`

Executes multiple functions in parallel and returns an array of `[error, result]` tuples.

- **Parameters**:
  - `fns`: Array of functions to execute.
  - `options`: Configuration options for each execution.

- **Returns**: An array of `[error, result]` tuples.

### `configureSafeExecute(config)`

Configures global behavior for `safeExecute`.

- **Parameters**:
  - `config`: An object with the following properties:
    - `errorHandler`: A global error handler.
    - `defaultValue`: A global fallback value.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://github.com/tyrog07/arctics-graceful-executor/blob/HEAD/LICENSE).
