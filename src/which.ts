import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

type Binding = typeof import('./binding.ts');
type Shell = typeof import('./shell.ts');

export enum Mode {
  AUTO = 'auto',
  BINDING = 'binding',
  SHELL = 'shell',
}

export const state: {
  binding: Binding | null;
  mode: Mode.BINDING | Mode.SHELL | null;
  shell: Shell | null;
} = {
  binding: null,
  mode: null,
  shell: null,
};

const canFallback = (error: unknown) =>
  state.mode === Mode.BINDING &&
  error instanceof Error &&
  error.message === 'The specified procedure could not be found.';

/**
 * @param strict For testing. When `true`, automatic fallback to the shell will be skipped.
 */
export const changeImplementation = (mode: Mode, strict?: boolean) => {
  if (mode === Mode.AUTO || mode === Mode.BINDING) {
    try {
      state.binding = require('./binding.js'); // TypeScript doesn't rewrite `require('*.ts')`
      state.mode = Mode.BINDING;
      state.shell = null;
    } catch (error) {
      if (!strict) {
        changeImplementation(Mode.SHELL);
      } else {
        throw error;
      }
    }
  } else {
    state.binding = null;
    state.mode = Mode.SHELL;
    state.shell = require('./shell.js'); // TypeScript doesn't rewrite `require('*.ts')`
  }
};

export const currentImplementation = (): Binding | Shell | null =>
  state.mode === null ? null : state[state.mode];

/**
 * Run an implementation's function (within `fn`) and it will fall-back to `Mode.SHELL` if `Mode.BINDING` fails.
 */
export const run = <T>(fn: (state: Binding | Shell) => T): T => {
  try {
    return fn(currentImplementation()!); // It's only ever null in tests after a brief reset
  } catch (error) {
    if (canFallback(error)) {
      changeImplementation(Mode.SHELL);
      return fn(currentImplementation()!); // It's only ever null in tests after a brief reset
    } else {
      throw error;
    }
  }
};

/**
 * Run an implementation's function (within `fn`) and it will fall-back to `Mode.SHELL` if `Mode.BINDING` fails.
 */
export const runAsync = async <T>(fn: (state: Binding | Shell) => T): Promise<T> => {
  try {
    return await fn(currentImplementation()!); // It's only ever null in tests after a brief reset
  } catch (error) {
    if (canFallback(error)) {
      changeImplementation(Mode.SHELL);
      return await fn(currentImplementation()!); // It's only ever null in tests after a brief reset
    } else {
      throw error;
    }
  }
};
