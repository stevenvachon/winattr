import { describe, expect, it, vi } from 'vitest';
import execFileAsync from '../src/execFileAsync.ts';
import { execFileSync } from 'node:child_process';
import { get, getSync, UnknownError } from '../src/shell.ts';

vi.mock('../src/execFileAsync.ts', async importOriginal => {
  const actual = await importOriginal<typeof import('../src/execFileAsync.ts')>();
  return {
    ...actual,
    default: vi.fn(actual.default),
  };
});

vi.mock('node:child_process', async importOriginal => {
  const actual = await importOriginal<typeof import('node:child_process')>();
  return {
    ...actual,
    execFileSync: vi.fn(actual.execFileSync),
  };
});

describe('cscript failure', () => {
  it('throws if get stdout is empty asynchronously', () => {
    vi.mocked(execFileAsync).mockResolvedValue({ stdout: '', stderr: '' });

    return expect(get('./irrelevant')).rejects.toThrow(UnknownError);
  });

  it('throws if get stdout is empty synchronously', () => {
    vi.mocked(execFileSync).mockReturnValue('');
    expect(() => getSync('./irrelevant')).toThrow(UnknownError);
  });
});
