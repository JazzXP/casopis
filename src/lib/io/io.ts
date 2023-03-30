import type { RequestEvent } from "@sveltejs/kit";
import type { Abortable } from "events";
import type { MakeDirectoryOptions, Mode, ObjectEncodingOptions, OpenMode, PathLike } from "fs";
import type { FileHandle } from "fs/promises";
import sharp from "sharp";
import type { Stream } from "stream";

export interface io {
  mkdir(
    path: PathLike,
    options: MakeDirectoryOptions & {
      recursive: true;
    }
  ): Promise<string | undefined>;
  writeFile(
    file: PathLike | FileHandle,
    data: string | NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView> | AsyncIterable<string | NodeJS.ArrayBufferView> | Stream,
    options?:
      | (ObjectEncodingOptions & {
        mode?: Mode | undefined;
        flag?: OpenMode | undefined;
      } & Abortable)
      | BufferEncoding
      | null
  ): Promise<void>;

  readFile(
    path: PathLike | FileHandle,
    options?:
      | ({
        encoding?: null | undefined;
        flag?: OpenMode | undefined;
      } & Abortable)
      | null
  ): Promise<Buffer>;
}

export interface ioSync {
  existsSync(path: PathLike): boolean;
}

const path = process.env.FILEPATH ?? './public/files';

export async function writeMD({ request }: RequestEvent, io: io) {
  const data = await request.formData();
  const md = data.get('md') as string;
  try {
    await io.mkdir(`${path}/${data.get('date')}/`, { recursive: true });
    await io.writeFile(`${path}/${data.get('date')}/index.md`, md);
  } catch (err) {
    console.error(err);
    return { success: false };
  }

  return { success: true };
}

export async function uploadImage({ request }: RequestEvent, io: io) {
  const data = await request.formData();
  const file = data.get('file') as File;
  const dateString = data.get('date');
  const re = /(?:\.([^.]+))?$/;
  const ext = re.exec(file.name)?.[1] ?? '';
  const filename = file.name.substring(0, file.name.length - (ext?.length ?? 0) - 1).replaceAll(/[\s\/\.\(\)\[\]]/g, '');
  await io.mkdir(`${path}/${dateString}`, { recursive: true });
  await io.writeFile(`${path}/${dateString}/${filename}.${ext}`, await sharp(new Int8Array(await file.arrayBuffer())).resize(600), {});

  return { success: true, filename: `/files/${dateString}/${filename}.${ext}` };
}

export async function loadMD(date: string, today: string, io: io, ioSync: ioSync): Promise<string | null> {
  try {
    let mdFile: Buffer;
    if (ioSync.existsSync(`${path}/${date}/index.md`)) {
      mdFile = await io.readFile(`${path}/${date}/index.md`);
      return mdFile.toString();
    }
    else if (today === date && ioSync.existsSync('./client/template.md')) {
      mdFile = await io.readFile('./client/template.md');
      return mdFile.toString();
    }
    return 'No entry';
  } catch (err) {
    console.error(err);
    return null;
  }
}