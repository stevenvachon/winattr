import type { Attributes, SetAttributes } from './types.ts';
import {
  type Attributes as FswinAttributes,
  getAttributesAsync,
  getAttributesSync,
  type SetAttributes as SetFswinAttributes,
  setAttributesAsync,
  setAttributesSync,
} from 'fswin';
import InaccessiblePathError from './InaccessiblePathError.ts';

/**
 * Convert winattr attributes to fswin attributes.
 */
const convertToFswin = ({ archive, hidden, readonly, system }: SetAttributes): SetFswinAttributes =>
  Object.fromEntries(
    Object.entries({
      IS_ARCHIVED: archive,
      IS_HIDDEN: hidden,
      IS_READ_ONLY: readonly,
      IS_SYSTEM: system,
    }).filter(([_name, value]) => value !== undefined)
  );

/**
 * Convert fswin attributes to winattr attributes.
 */
const convertToWinattr = ({
  IS_ARCHIVED,
  IS_HIDDEN,
  IS_READ_ONLY,
  IS_SYSTEM,
}: FswinAttributes): Attributes => ({
  archive: IS_ARCHIVED,
  hidden: IS_HIDDEN,
  readonly: IS_READ_ONLY,
  system: IS_SYSTEM,
});

/**
 * @throws {InaccessiblePathError} When `path` could not be accessed.
 */
export const get = async (path: string) => {
  const attrs = await getAttributesAsync(path);

  if (attrs === null) {
    throw new InaccessiblePathError(path);
  }

  return convertToWinattr(attrs);
};

/**
 * @throws {InaccessiblePathError} When `path` could not be accessed.
 */
export const getSync = (path: string) => {
  const attrs = getAttributesSync(path);

  if (attrs === null) {
    throw new InaccessiblePathError(path);
  }

  return convertToWinattr(attrs);
};

/**
 * @throws {InaccessiblePathError} When `path` could not be accessed.
 */
export const set = async (path: string, attrs: SetAttributes) => {
  if (!(await setAttributesAsync(path, convertToFswin(attrs)))) {
    throw new InaccessiblePathError(path);
  }
};

/**
 * @throws {InaccessiblePathError} When `path` could not be accessed.
 */
export const setSync = (path: string, attrs: SetAttributes) => {
  if (!setAttributesSync(path, convertToFswin(attrs))) {
    throw new InaccessiblePathError(path);
  }
};
