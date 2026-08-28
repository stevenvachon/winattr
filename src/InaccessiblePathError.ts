/**
 * An error thrown when a path either doesn't exist or was unauthorized.
 * This could come from the native binding or the fallback shell commands.
 */
class InaccessiblePathError extends Error {
  #path: string;

  constructor(path: string) {
    super(`${path} is inaccessible`);
    this.#path = path;
  }

  get path() {
    /* v8 ignore next */
    return this.#path;
  }
}

export default InaccessiblePathError;
