import type { RequestEvent } from "@sveltejs/kit";
import fsSync from "fs";
import fs from 'fs/promises';
import path from "path";
import sharp from "sharp";

const filePath = process.env.FILEPATH ?? './public/files';

export interface Entry {
  path: string,
  image: string,
  subject: string,
  formattedDate: string,
  date: string,
}

export async function writeMD({ request }: RequestEvent) {
  const data = await request.formData();
  const md = data.get('md') as string;
  try {
    await fs.mkdir(`${filePath}/${data.get('date')}/`, { recursive: true });
    await fs.writeFile(`${filePath}/${data.get('date')}/index.md`, md);
  } catch (err) {
    console.error(err);
    return { success: false };
  }

  return { success: true };
}

export async function uploadImage({ request }: RequestEvent) {
  const data = await request.formData();
  const file = data.get('file') as File;
  const dateString = data.get('date');
  const re = /(?:\.([^.]+))?$/;
  const ext = re.exec(file.name)?.[1] ?? '';
  const filename = file.name.substring(0, file.name.length - (ext?.length ?? 0) - 1).replaceAll(/[\s\/\.\(\)\[\]]/g, '');
  await fs.mkdir(`${filePath}/${dateString}`, { recursive: true });
  await fs.writeFile(`${filePath}/${dateString}/${filename}.${ext}`, await sharp(new Int8Array(await file.arrayBuffer())).resize(600), {});

  return { success: true, filename: `/files/${dateString}/${filename}.${ext}` };
}

export async function loadMD(date: string, today: string): Promise<string | null> {
  try {
    let mdFile: Buffer;
    if (fsSync.existsSync(`${filePath}/${date}/index.md`)) {
      mdFile = await fs.readFile(`${filePath}/${date}/index.md`);
      return mdFile.toString();
    }
    else if (today === date && fsSync.existsSync('./client/template.md')) {
      mdFile = await fs.readFile('./client/template.md');
      return mdFile.toString();
    }
    return 'No entry';
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function entries(rootPath: string) {
  const files = await fs.readdir(rootPath);
  const entries: Entry[] = [];
  for (const file of files) {
    const absolutePath = path.join(rootPath, file);
    if (await isDirectory(absolutePath)) {
      const indexPath = path.join(absolutePath, 'index.md');
      if (fsSync.existsSync(indexPath)) {
        const handle = await fs.open(indexPath);
        let subject = '';
        let image = '';
        for await (const line of handle.readLines()) {
          if (subject.length === 0 && line.startsWith('# ')) {
            subject = line;
          } else if (/\!\[.*\]\(.*\)/.test(line)) {
            image = /\!\[.*\]\((.*)\)/.exec(line)?.[1] ?? '';
          }
        }
        entries.push({
          path: absolutePath,
          image,
          subject: subject.replace('# ', ''),
          date: file,
          formattedDate: dateFromPathString(file),
        });
      }
    }
  }
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

async function isDirectory(path: string) {
  const stats = await fs.stat(path);

  return stats.isDirectory();
}

function dateFromPathString(path: string) {
  return path.substring(6, 8) + '/' + path.substring(4, 6) + '/' + path.substring(0, 4);
}