import type { Attributes, SetAttributes } from './types.ts';
import { changeImplementation, Mode, run, runAsync } from './which.ts';
import isWindows from 'is-windows';
import { resolve as resolvePath } from 'node:path';

export { default as InaccessiblePathError } from './InaccessiblePathError.ts';
export { UnknownError } from './shell.ts';

export type { Attributes, SetAttributes };

/**
 * An error thrown when the operating system is anything other than Windows.
 */
export class NotWindowsError extends Error {
  constructor() {
    super('Not a Windows platform');
  }
}

const checkWindows = () => {
  if (!isWindows()) {
    throw new NotWindowsError();
  }
};

/**
 * Get Windows file system attributes for `path`.
 * @throws {InaccessiblePathError} When `path` could not be accessed by the native binding.
 * @throws {NotWindowsError} When not running on a Windows platform.
 * @throws {UnknownError} When the fallback `cscript` command fails unexpectedly.
 */
export const getAttributes = (path: string) =>
  Promise.try(checkWindows).then(() =>
    runAsync(implementation => implementation.get(resolvePath(path)))
  );

/**
 * Synchronously get Windows file system attributes for `path`.
 * @throws {InaccessiblePathError} When `path` could not be accessed by the native binding.
 * @throws {NotWindowsError} When not running on a Windows platform.
 * @throws {UnknownError} When the fallback `cscript` command fails unexpectedly.
 */
export const getAttributesSync = (path: string) => {
  checkWindows();
  return run(implementation => implementation.getSync(resolvePath(path)));
};

/**
 * Set Windows file system attributes for `path`.
 * @throws {InaccessiblePathError} When `path` could not be accessed by the native binding.
 * @throws {NotWindowsError} When not running on a Windows platform.
 * @throws {UnknownError} When the fallback `attrib` command fails unexpectedly.
 */
export const setAttributes = (path: string, attrs: SetAttributes) =>
  Promise.try(checkWindows).then(() =>
    runAsync(implementation => implementation.set(resolvePath(path), attrs))
  );

/**
 * Synchronously set Windows file system attributes for `path`.
 * @throws {InaccessiblePathError} When `path` could not be accessed by the native binding.
 * @throws {NotWindowsError} When not running on a Windows platform.
 * @throws {UnknownError} When the fallback `attrib` command fails unexpectedly.
 */
export const setAttributesSync = (path: string, attrs: SetAttributes) => {
  checkWindows();
  return run(implementation => implementation.setSync(resolvePath(path), attrs));
};

changeImplementation(Mode.AUTO);
