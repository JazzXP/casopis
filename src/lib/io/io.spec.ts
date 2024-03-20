/* eslint-disable @typescript-eslint/no-explicit-any */
// vi.mock('fs/promises');
// vi.mock('fs');
// import { jest } from '@jest/globals';
import { test, describe, afterEach, beforeEach, vi, expect } from 'vitest';
import { entries, loadMD, writeMD } from './io';
import fs, { type PathLike } from 'fs';
import fsPromise from 'fs/promises';

describe('io functions', () => {
  beforeEach(() => {
    vi.mock('fs/promises');
    vi.mock('fs');
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  test('writes a file', async () => {
    const formData = new FormData();
    formData.append('md', 'MD File');
    formData.append('date', '20230101');
    fsPromise.writeFile = vi.fn();
    const spy = vi.spyOn(fsPromise, 'writeFile');

    await writeMD({
      ...event,
      request: { ...event.request, formData: () => Promise.resolve(formData) },
    });

    expect(spy).toBeCalledWith('./public/files/20230101/index.md', 'MD File');
    spy.mockRestore();
  });

  test('reads a file when it exists and same day', async () => {
    const formData = new FormData();
    formData.append('date', '20230101');
    fs.existsSync = vi.fn((path: PathLike) => path === './public/files/20230101/index.md');
    (fsPromise.readFile as unknown) = vi.fn();
    (fsPromise.readFile as any).mockReturnValue('MD File');
    const spy = vi.spyOn(fsPromise, 'readFile');

    const resp = await loadMD('20230101', '20230101');
    expect(resp).toBe('MD File');
    expect(spy).toBeCalledWith('./public/files/20230101/index.md');
    spy.mockRestore();
  });

  test('reads a file when it exists and yesterday', async () => {
    const formData = new FormData();
    formData.append('date', '20230101');
    fs.existsSync = vi.fn((path: PathLike) => path === './public/files/20230101/index.md');
    (fsPromise.readFile as any) = vi.fn();
    (fsPromise.readFile as any).mockReturnValue('MD File');
    const spy = vi.spyOn(fsPromise, 'readFile');

    const resp = await loadMD('20230101', '20230102');
    expect(resp).toBe('MD File');
    expect(spy).toBeCalledWith('./public/files/20230101/index.md');
    spy.mockRestore();
  });

  test('reads a file when does not exist and same day', async () => {
    const formData = new FormData();
    formData.append('date', '20230101');
    fs.existsSync = vi.fn((path: PathLike) => path === './client/template.md');
    (fsPromise.readFile as any) = vi.fn();
    (fsPromise.readFile as any).mockReturnValue('MD File');
    const spy = vi.spyOn(fsPromise, 'readFile');

    const resp = await loadMD('20230101', '20230101');
    expect(resp).toBe('MD File');
    expect(spy).toBeCalledWith('./client/template.md');
    spy.mockRestore();
  });

  test('does not read a file when it does not exist and yesterday', async () => {
    const formData = new FormData();
    formData.append('date', '20230101');
    fs.existsSync = vi.fn((path: PathLike) => path === './client/template.md');
    (fsPromise.readFile as any) = vi.fn();
    (fsPromise.readFile as any).mockReturnValue('MD File');
    const spy = vi.spyOn(fsPromise, 'readFile');

    const resp = await loadMD('20230101', '20230102');
    expect(resp).toBe('No entry');
    expect(spy).not.toBeCalled();
    spy.mockRestore();
  });

  test('reads entries and returns data', async () => {
    (fsPromise.readdir as any) = vi.fn();
    (fsPromise.readdir as any).mockReturnValue(['20230101', '20230102', '20230103']);
    fs.existsSync = vi.fn(() => true);
    (fsPromise.open as any) = vi.fn(() => ({
      readLines: vi.fn(() => ['# title', '![img.jpg](/files/img.jpg)']),
    }));
    (fsPromise.stat as any) = vi.fn(() => ({ isDirectory: () => true }));

    const resp = await entries('');
    expect(resp).toStrictEqual([
      {
        path: '20230103',
        image: '/files/img.jpg',
        subject: 'title',
        date: '20230103',
        formattedDate: '03/01/2023',
      },
      {
        path: '20230102',
        image: '/files/img.jpg',
        subject: 'title',
        date: '20230102',
        formattedDate: '02/01/2023',
      },
      {
        path: '20230101',
        image: '/files/img.jpg',
        subject: 'title',
        date: '20230101',
        formattedDate: '01/01/2023',
      },
    ]);
  });
});

const event = {
  cookies: {
    get: () => '',
    getAll: () => [],
    set: () => {},
    delete: () => {},
    serialize: () => '',
  },
  fetch: () => Promise.resolve(new Response()),
  getClientAddress: () => '',
  locals: {},
  params: {},
  platform: '',
  request: new Request('http://blank.com'),
  route: { id: null },
  setHeaders: () => {},
  url: new URL('http://a.com'),
  isDataRequest: false,
  isSubRequest: false,
};
