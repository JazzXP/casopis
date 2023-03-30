import { jest } from '@jest/globals';
import { loadMD, uploadImage, writeMD } from './io';
import type { PathLike } from 'fs';

describe('io functions', () => {
  const mockedIO = {
    writeFile: () => Promise.resolve(),
    readFile: () => Promise.resolve(Buffer.from('MD File')),
    mkdir: () => Promise.resolve(''),
    existsSync: () => true,
  };

  test('writes a file', async () => {
    const formData = new FormData();
    formData.append("md", 'MD File');
    formData.append('date', '20230101');
    const spy = jest.spyOn(mockedIO, 'writeFile');

    await writeMD({ ...event, request: { ...event.request, formData: () => Promise.resolve(formData) } }, mockedIO);

    expect(spy).toBeCalledWith('./public/files/20230101/index.md', 'MD File');
    spy.mockRestore();
  });

  test('reads a file when it exists and same day', async () => {
    const formData = new FormData();
    formData.append('date', '20230101');
    const spy = jest.spyOn(mockedIO, 'readFile');

    const resp = await loadMD('20230101', '20230101', mockedIO, mockedIO);
    expect(resp).toBe('MD File');
    expect(spy).toBeCalledWith('./public/files/20230101/index.md');
    spy.mockRestore();
  });

  test('reads a file when it exists and yesterday', async () => {
    const formData = new FormData();
    formData.append('date', '20230101');
    const spy = jest.spyOn(mockedIO, 'readFile');

    const resp = await loadMD('20230101', '20230102', mockedIO, mockedIO);
    expect(resp).toBe('MD File');
    expect(spy).toBeCalledWith('./public/files/20230101/index.md');
    spy.mockRestore();
  });

  test('reads a file when does not exist and same day', async () => {
    const formData = new FormData();
    formData.append('date', '20230101');
    const newIO = { ...mockedIO, existsSync: (path: PathLike) => path === './client/template.md' };
    const spy = jest.spyOn(newIO, 'readFile');

    const resp = await loadMD('20230101', '20230101', newIO, newIO);
    expect(resp).toBe('MD File');
    expect(spy).toBeCalledWith('./client/template.md');
    spy.mockRestore();
  });

  test('does not read a file when it does not exist and yesterday', async () => {
    const formData = new FormData();
    formData.append('date', '20230101');
    const newIO = { ...mockedIO, existsSync: (path: PathLike) => path === './client/template.md' };
    const spy = jest.spyOn(newIO, 'readFile');

    const resp = await loadMD('20230101', '20230102', newIO, newIO);
    expect(resp).toBe('No entry');
    expect(spy).not.toBeCalled();
    spy.mockRestore();
  });
});

const event = {
  cookies: {
    get: () => '',
    getAll: () => [],
    set: () => { },
    delete: () => { },
    serialize: () => '',
  },
  fetch: () => Promise.resolve(new Response()),
  getClientAddress: () => '',
  locals: {},
  params: {},
  platform: '',
  request: new Request(''),
  route: { id: null },
  setHeaders: (new_headers: any) => { },
  url: new URL('http://a.com'),
  isDataRequest: false
};

