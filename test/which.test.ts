import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  changeImplementation,
  currentImplementation,
  state,
  Mode,
  run,
  runAsync,
} from '../src/which.ts';
import * as shell from '../src/shell.ts';

const { bindingLoadError } = vi.hoisted(() => ({
  bindingLoadError: { current: undefined as Error | undefined },
}));

// Handle `require('*.js')` in source code
vi.mock('node:module', async importOriginal => {
  const actual = await importOriginal<typeof import('node:module')>();
  const bindingModule = await import('../src/binding.ts');
  const shellModule = await import('../src/shell.ts');

  return {
    ...actual,
    createRequire: (filename: string | URL) => {
      const req = actual.createRequire(filename);
      return Object.assign((id: string) => {
        if (id === './binding.js') {
          if (bindingLoadError.current) {
            throw bindingLoadError.current;
          }
          return bindingModule;
        }
        if (id === './shell.js') {
          return shellModule;
        }
        return req(id);
      }, req);
    },
  };
});

it('currentImplementation() is null initially', () => expect(currentImplementation()).toBe(null));

describe('binding load failure', () => {
  class BindingError extends Error {
    constructor() {
      super('fswin missing');
    }
  }

  const reset = () => {
    state.mode = null;
    state.binding = null;
    state.shell = null;
  };

  const withBrokenBinding = <T>(callback: () => T) => {
    bindingLoadError.current = new BindingError();
    try {
      return callback();
    } finally {
      bindingLoadError.current = undefined;
    }
  };

  beforeEach(reset);

  afterAll(() => {
    reset();
    changeImplementation(Mode.AUTO);
  });

  it('falls back to shell when not strict', () => {
    withBrokenBinding(() => changeImplementation(Mode.AUTO));
    expect(currentImplementation()).toBe(shell);
  });

  it('throws when strict', () =>
    withBrokenBinding(() =>
      expect(() => changeImplementation(Mode.BINDING, true)).toThrow(BindingError)
    ));
});

describe('binding procedure failure', () => {
  const ERROR_MESSAGE = 'The specified procedure could not be found.';

  afterAll(() => changeImplementation(Mode.AUTO));

  it('falls back to shell asynchronously', async () => {
    changeImplementation(Mode.BINDING, true);
    await expect(
      runAsync(() => {
        if (state.mode === Mode.BINDING) {
          return Promise.reject(new Error(ERROR_MESSAGE));
        }
        return true;
      })
    ).resolves.toBe(true);
    expect(currentImplementation()).toBe(shell);
  });

  it('falls back to shell synchronously', () => {
    changeImplementation(Mode.BINDING, true);
    expect(
      run(() => {
        if (state.mode === Mode.BINDING) {
          throw new Error(ERROR_MESSAGE);
        }
        return true;
      })
    ).toBe(true);
    expect(currentImplementation()).toBe(shell);
  });
});
