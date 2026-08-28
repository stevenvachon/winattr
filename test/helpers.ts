import {
  type Attributes,
  getAttributes,
  getAttributesSync,
  setAttributes,
  setAttributesSync,
  type SetAttributes,
} from '../src/index.ts';
import { changeImplementation, Mode } from '../src/which.ts';
import { mkdir, rmdir, unlink, writeFile } from 'node:fs/promises';
import { mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs';

/**
 * All attributes set to `true`.
 */
export const ALL_ATTRIBUTES = {
  archive: true,
  hidden: true,
  readonly: true,
  system: true,
} as const satisfies Attributes;

/**
 * Defaults all attributes to `false` before applying any overrides.
 */
export const defaultAttributes = (overrides?: SetAttributes): Attributes => ({
  archive: false,
  hidden: false,
  readonly: false,
  system: false,
  ...overrides,
});

export const FIXTURES_DIR = './test/fixtures'; // Relative to project root

/**
 * Create a new file fixture, set and get its attributes with a specific implementation, then remove.
 *
 * Note: `attrs` must be contain all attributes so that tests can behave predictably.
 */
export const newFile = async (filename: string, attrs: Attributes, mode: Mode) => {
  const fixturePath = resolveFixturePath(filename);
  await writeFile(fixturePath, '');
  let result;

  try {
    changeImplementation(mode, true);
    result = await setGetAttributes(fixturePath, attrs);
    await setAttributes(fixturePath, defaultAttributes()); // Set attributes to false to avoid EPERM issues when deleting
  } catch (error) {
    throw error;
  } finally {
    await unlink(fixturePath); // Remove test file
  }

  return result;
};

/**
 * Create a new file fixture, set and get its attributes with a specific implementation, then remove.
 *
 * Note: `attrs` must be contain all attributes so that tests can behave predictably.
 */
export const newFileSync = (filename: string, attrs: Attributes, mode: Mode) => {
  const fixturePath = resolveFixturePath(filename);
  writeFileSync(fixturePath, '');
  let result;

  try {
    changeImplementation(mode, true);
    result = setGetAttributesSync(fixturePath, attrs);
    setAttributesSync(fixturePath, defaultAttributes()); // Set attributes to false to avoid EPERM issues when deleting
  } catch (error) {
    throw error;
  } finally {
    unlinkSync(fixturePath); // Remove test file
  }

  return result;
};

/**
 * Create a new directory/folder fixture, set and get its attributes with a specific implementation, then remove.
 *
 * Note: `attrs` must be contain all attributes so that tests can behave predictably.
 */
export const newFolder = async (dirname: string, attrs: Attributes, mode: Mode) => {
  const fixturePath = resolveFixturePath(dirname);
  await mkdir(fixturePath);
  let result;

  try {
    changeImplementation(mode, true);
    result = await setGetAttributes(fixturePath, attrs);
    await setAttributes(fixturePath, defaultAttributes()); // Set attributes to false to avoid EPERM issues when deleting
  } catch (error) {
    throw error;
  } finally {
    await rmdir(fixturePath); // Remove test dir
  }

  return result;
};

/**
 * Create a new directory/folder fixture, set and get its attributes with a specific implementation, then remove.
 *
 * Note: `attrs` must be contain all attributes so that tests can behave predictably.
 */
export const newFolderSync = (dirname: string, attrs: Attributes, mode: Mode) => {
  const fixturePath = resolveFixturePath(dirname);
  mkdirSync(fixturePath);
  let result;

  try {
    changeImplementation(mode, true);
    result = setGetAttributesSync(fixturePath, attrs);
    setAttributesSync(fixturePath, defaultAttributes()); // Set attributes to false to avoid EPERM issues when deleting
  } catch (error) {
    throw error;
  } finally {
    rmdirSync(fixturePath); // Remove test dir
  }

  return result;
};

const resolveFixturePath = (filenameOrDirname: string) => `${FIXTURES_DIR}/${filenameOrDirname}`;

const setGetAttributes = async (path: string, attrs: SetAttributes) => {
  await setAttributes(path, attrs);
  return getAttributes(path);
};

const setGetAttributesSync = (path: string, attrs: SetAttributes) => {
  setAttributesSync(path, attrs);
  return getAttributesSync(path);
};
