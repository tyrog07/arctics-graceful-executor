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
4. [Contributing](#contributing)
5. [License](#license)

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

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://github.com/tyrog07/arctics-graceful-executor/blob/HEAD/LICENSE).
