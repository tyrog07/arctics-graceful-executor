# @arctics/graceful-executor (beta)

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

Tired of writing repetitive try...catch blocks? 😫 graceful-executor is a lightweight, zero-dependency TypeScript utility that simplifies asynchronous error handling.

It provides a clean, consistent way to execute sync or async functions, giving you a predictable [error, result] tuple that eliminates boilerplate code and makes your logic cleaner and more robust.

## Features

- `Centralized Error Handling`: Configure a global error handler and a default return value for your entire application. This is perfect for integrating with logging services.
- `Per-Call Overrides`: Easily override global settings with specific options for individual function calls.
- `Built-in finally`: Use the optional finally callback for guaranteed cleanup actions, like setting loading states, regardless of the outcome.
- `TypeScript-First`: Built with strong types to provide a safe and predictable development experience.
- `Universal`: Works seamlessly with both async and synchronous functions.

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

- CommonJS:

```
const { safeExecute, configureSafeExecute } = require('@arctics/graceful-executor');
```

- ES Modules:

```
import { safeExecute, configureSafeExecute } from '@arctics/graceful-executor';
```

### Configuration

You can configure global behavior for `safeExecute` using `configureSafeExecute`. This allows you to set a global error handler and a default fallback value.

```
import { configureSafeExecute } from '@arctics/graceful-executor';

configureSafeExecute({
  errorHandler: (error) => console.error('Global Error:', error),
  defaultValue: 'default value',
});
```

## Examples

### Synchronous Example

```
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

```
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

### Custom Error Handler and Fallback Value

You can override the global configuration for specific calls:

```
import { safeExecute } from '@arctics/graceful-executor';

function riskyFunction() {
  throw new Error('Something went wrong');
}

const [error, result] = safeExecute(riskyFunction, {
  errorHandler: (error) => console.warn('Custom Error Handler:', error),
  defaultValue: 'Custom fallback value',
});

console.log('Result:', result); // Logs: 'Custom fallback value'
```

### Finally Callback

You can also provide a `finally` callback that runs regardless of success or failure:

```
import { safeExecute } from '@arctics/graceful-executor';

function exampleFunction() {
  throw new Error('Example error');
}

safeExecute(exampleFunction, {
  finally: () => console.log('Cleanup logic executed'),
});
```

## API Reference

### `safeExecute(fn, options?)`

Safely executes a function and returns a tuple `[error, result]`.

- `Parameters`:
  - `fn`: The function to execute (can be synchronous or asynchronous).
  - `options` (optional): An object with the following properties:
    - `errorHandler`: A custom error handler for this specific call.
    - `defaultValue`: A fallback value to return if an error occurs.
    - `finally`: A callback function to execute after the operation.

- `Returns`: A tuple `[error, result]`.

### `configureSafeExecute(config)`

Configures global behavior for `safeExecute`.

- `Parameters`:
  - `config`: An object with the following properties:
    - `errorHandler`: A global error handler.
    - `defaultValue`: A global fallback value.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://github.com/tyrog07/arctics-graceful-executor/blob/HEAD/LICENSE).
