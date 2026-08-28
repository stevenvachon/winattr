import type { Attributes, SetAttributes } from './types.ts';
import execFileAsync from './execFileAsync.ts';
import { execFileSync } from 'node:child_process';
import InaccessiblePathError from './InaccessiblePathError.ts';

const ATTRIB_FLAGS = {
  archive: 'a',
  hidden: 'h',
  readonly: 'r',
  system: 's',
} as const;

const attribArgs = (path: string, attrs: SetAttributes) => [
  ...Object.entries(attrs)
    .filter(([name, value]) => name in ATTRIB_FLAGS && value !== undefined)
    .map(
      ([name, value]) => `${value ? '+' : '-'}${ATTRIB_FLAGS[name as keyof typeof ATTRIB_FLAGS]}`
    ),
  path,
];

const cscriptArgs = (path: string) => [
  '//nologo', // cspell:ignore nologo
  '//E:jscript', // cspell:ignore jscript
  `${import.meta.dirname}/shellGetAttributes.js`,
  path,
];

/**
 * @throws {UnknownError} When the `cscript` command fails unexpectedly.
 */
export const get = async (path: string) =>
  parseCscriptStdout(await shell('cscript', cscriptArgs(path)), path);

/**
 * @throws {UnknownError} When the `cscript` command fails unexpectedly.
 */
export const getSync = (path: string) =>
  parseCscriptStdout(shellSync('cscript', cscriptArgs(path)), path);

const parseAttribStdout = (stdout: string, path: string) => {
  stdout = stdout.trim();
  // `attrib` prints to stdout and still exits 0 when the path is missing
  if (stdout.length > 0) {
    throw new UnknownError(path, stdout);
  }
};

const parseCscriptStdout = (stdout: string, path: string) => {
  if (stdout.trim().length === 0) {
    throw new UnknownError(path);
  }

  let json: Attributes | { error: string };
  try {
    json = JSON.parse(stdout);
  } catch (error) {
    /* v8 ignore next */
    throw new UnknownError(path, error); // Instead of an ambiguous `SyntaxError`
  }

  if (json && typeof json === 'object' && 'error' in json) {
    /* v8 ignore next */
    if (json.error === 'Unknown error') {
      throw new UnknownError(path, json.error);
    }

    throw new InaccessiblePathError(path);
  }

  return json;
};

/**
 * @throws {UnknownError} When the `attrib` command fails unexpectedly.
 */
export const set = async (path: string, attrs: SetAttributes) => {
  parseAttribStdout(await shell('attrib', attribArgs(path, attrs)), path);
};

/**
 * @throws {UnknownError} When the `attrib` command fails unexpectedly.
 */
export const setSync = (path: string, attrs: SetAttributes) => {
  parseAttribStdout(shellSync('attrib', attribArgs(path, attrs)), path);
};

const shell = async (command: string, args: string[]) =>
  (await execFileAsync(command, args)).stdout;

const shellSync = (command: string, args: string[]) =>
  execFileSync(command, args, { encoding: 'utf8' });

export class UnknownError extends Error {
  #path: string;

  constructor(path: string, cause?: unknown) {
    super('Unknown error', { cause });
    this.name = this.constructor.name;
    this.#path = path;
  }

  get path() {
    /* v8 ignore next */
    return this.#path;
  }
}
