import { beforeAll, describe, expect, it, vi } from 'vitest';
import {
  ALL_ATTRIBUTES,
  defaultAttributes,
  FIXTURES_DIR,
  newFile,
  newFileSync,
  newFolder,
  newFolderSync,
} from './helpers.ts';
import { Mode } from '../src/which.ts';
import {
  getAttributes,
  getAttributesSync,
  InaccessiblePathError,
  NotWindowsError,
  setAttributes,
  setAttributesSync,
  UnknownError,
} from '../src/index.ts';
import isWindows from 'is-windows';
import { mkdir } from 'node:fs/promises';

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

const MODES = [Mode.SHELL, Mode.AUTO, Mode.BINDING] as const;

beforeAll(() => mkdir(FIXTURES_DIR, { recursive: true }));

describe.skipIf(isWindows())('Unix', () =>
  MODES.forEach(mode =>
    describe(`with "${mode}" mode`, () => {
      describe('accessing files', () => {
        it('does not work asynchronously', () =>
          expect(newFile('normal.txt', defaultAttributes(), mode)).rejects.toThrow(
            NotWindowsError
          ));

        it('does not work synchronously', () =>
          expect(() => newFileSync('normal.txt', defaultAttributes(), mode)).toThrow(
            NotWindowsError
          ));
      });

      describe('accessing folders', () => {
        it('does not work asynchronously', () =>
          expect(newFolder('normal', defaultAttributes(), mode)).rejects.toThrow(NotWindowsError));

        it('does not work synchronously', () =>
          expect(() => newFolderSync('normal', defaultAttributes(), mode)).toThrow(
            NotWindowsError
          ));
      });
    })
  )
);

describe.skipIf(!isWindows())('Windows', { timeout: 10_000 }, () =>
  MODES.forEach(mode =>
    describe(`with "${mode}" mode`, () => {
      describe('accessing files', () => {
        describe('asynchronously', () => {
          it('sets to nothing', () =>
            expect(newFile('normal.txt', defaultAttributes(), mode)).resolves.toEqual({
              archive: false,
              hidden: false,
              readonly: false,
              system: false,
            }));

          it('sets to archive', () =>
            expect(
              newFile('archive.txt', defaultAttributes({ archive: true }), mode)
            ).resolves.toEqual({
              archive: true,
              hidden: false,
              readonly: false,
              system: false,
            }));

          it('sets to hidden', () =>
            expect(
              newFile('hidden.txt', defaultAttributes({ hidden: true }), mode)
            ).resolves.toEqual({
              archive: false,
              hidden: true,
              readonly: false,
              system: false,
            }));

          it('sets to readonly', () =>
            expect(
              newFile('readonly.txt', defaultAttributes({ readonly: true }), mode)
            ).resolves.toEqual({
              archive: false,
              hidden: false,
              readonly: true,
              system: false,
            }));

          it('sets to system', () =>
            expect(
              newFile('system.txt', defaultAttributes({ system: true }), mode)
            ).resolves.toEqual({
              archive: false,
              hidden: false,
              readonly: false,
              system: true,
            }));

          it('sets all attributes', () =>
            expect(newFile('all.txt', ALL_ATTRIBUTES, mode)).resolves.toEqual({
              archive: true,
              hidden: true,
              readonly: true,
              system: true,
            }));

          it('throws if non-existent', async () => {
            await expect(setAttributes('./fake-file', { readonly: true })).rejects.toThrow(
              mode === Mode.SHELL ? UnknownError : InaccessiblePathError
            );
            await expect(getAttributes('./fake-file')).rejects.toThrow(InaccessiblePathError);
          });
        });

        describe('synchronously', () => {
          it('sets to nothing', () =>
            expect(newFileSync('normal.txt', defaultAttributes(), mode)).toEqual({
              archive: false,
              hidden: false,
              readonly: false,
              system: false,
            }));

          it('sets to archive', () =>
            expect(newFileSync('archive.txt', defaultAttributes({ archive: true }), mode)).toEqual({
              archive: true,
              hidden: false,
              readonly: false,
              system: false,
            }));

          it('sets to hidden', () =>
            expect(newFileSync('hidden.txt', defaultAttributes({ hidden: true }), mode)).toEqual({
              archive: false,
              hidden: true,
              readonly: false,
              system: false,
            }));

          it('sets to readonly', () =>
            expect(
              newFileSync('readonly.txt', defaultAttributes({ readonly: true }), mode)
            ).toEqual({
              archive: false,
              hidden: false,
              readonly: true,
              system: false,
            }));

          it('sets to system', () =>
            expect(newFileSync('system.txt', defaultAttributes({ system: true }), mode)).toEqual({
              archive: false,
              hidden: false,
              readonly: false,
              system: true,
            }));

          it('sets all attributes', () =>
            expect(newFileSync('all.txt', ALL_ATTRIBUTES, mode)).toEqual({
              archive: true,
              hidden: true,
              readonly: true,
              system: true,
            }));

          it('throws if non-existent', () => {
            expect(() => setAttributesSync('./fake-file', { readonly: true })).toThrow(
              mode === Mode.SHELL ? UnknownError : InaccessiblePathError
            );
            expect(() => getAttributesSync('./fake-file')).toThrow(InaccessiblePathError);
          });
        });
      });

      describe('accessing folders', () => {
        describe('asynchronously', () => {
          it('sets to nothing', () =>
            expect(newFolder('normal', defaultAttributes(), mode)).resolves.toEqual({
              archive: false,
              hidden: false,
              readonly: false,
              system: false,
            }));

          it('sets to archive', () =>
            expect(
              newFolder('archive', defaultAttributes({ archive: true }), mode)
            ).resolves.toEqual({
              archive: true,
              hidden: false,
              readonly: false,
              system: false,
            }));

          it('sets to hidden', () =>
            expect(newFolder('hidden', defaultAttributes({ hidden: true }), mode)).resolves.toEqual(
              {
                archive: false,
                hidden: true,
                readonly: false,
                system: false,
              }
            ));

          it('sets to readonly', () =>
            expect(
              newFolder('readonly', defaultAttributes({ readonly: true }), mode)
            ).resolves.toEqual({
              archive: false,
              hidden: false,
              readonly: true,
              system: false,
            }));

          it('sets to system', () =>
            expect(newFolder('system', defaultAttributes({ system: true }), mode)).resolves.toEqual(
              {
                archive: false,
                hidden: false,
                readonly: false,
                system: true,
              }
            ));

          it('sets all attributes', () =>
            expect(newFolder('all', ALL_ATTRIBUTES, mode)).resolves.toEqual({
              archive: true,
              hidden: true,
              readonly: true,
              system: true,
            }));
        });

        describe('synchronously', () => {
          it('sets to nothing', () =>
            expect(newFolderSync('normal', defaultAttributes(), mode)).toEqual({
              archive: false,
              hidden: false,
              readonly: false,
              system: false,
            }));

          it('sets to archive', () =>
            expect(newFolderSync('archive', defaultAttributes({ archive: true }), mode)).toEqual({
              archive: true,
              hidden: false,
              readonly: false,
              system: false,
            }));

          it('sets to hidden', () =>
            expect(newFolderSync('hidden', defaultAttributes({ hidden: true }), mode)).toEqual({
              archive: false,
              hidden: true,
              readonly: false,
              system: false,
            }));

          it('sets to readonly', () =>
            expect(newFolderSync('readonly', defaultAttributes({ readonly: true }), mode)).toEqual({
              archive: false,
              hidden: false,
              readonly: true,
              system: false,
            }));

          it('sets to system', () =>
            expect(newFolderSync('system', defaultAttributes({ system: true }), mode)).toEqual({
              archive: false,
              hidden: false,
              readonly: false,
              system: true,
            }));

          it('sets all attributes', () =>
            expect(newFolderSync('all', ALL_ATTRIBUTES, mode)).toEqual({
              archive: true,
              hidden: true,
              readonly: true,
              system: true,
            }));
        });
      });
    })
  )
);
