import { writeFile, mkdir, readFile } from 'fs/promises';

import sharp from 'sharp';
import type { PageServerLoad, RequestEvent } from './$types';
import { existsSync } from 'fs';

const path = process.env.FILEPATH ?? './public/files';

export const actions = {
  upload: async ({ request }: RequestEvent) => {
    const data = await request.formData();
    const file = data.get('file') as File;
    const dateString = data.get('date');
    const re = /(?:\.([^.]+))?$/;
    const ext = re.exec(file.name)?.[1] ?? '';
    const filename = file.name.substring(0, file.name.length - (ext?.length ?? 0) - 1).replaceAll(/[\s\/\.\(\)\[\]]/g, '');
    await mkdir(`${path}/${dateString}`, { recursive: true });
    await writeFile(`${path}/${dateString}/${filename}.${ext}`, await sharp(new Int8Array(await file.arrayBuffer())).resize(600), {});

    return { success: true, filename: `/files/${dateString}/${filename}.${ext}` };
  },
  writeMD: async ({ request }: RequestEvent) => {
    const data = await request.formData();
    const md = data.get('md') as string;
    try {
      await mkdir(`${path}/${data.get('date')}/`, { recursive: true });
      await writeFile(`${path}/${data.get('date')}/index.md`, md);
    } catch (err) {
      console.error(err);
      return { success: false };
    }

    return { success: true };
  },
  default: () => {
    return {
      success: false
    };
  }
};

export const load: PageServerLoad = async ({ params }) => {
  try {
    let mdFile: Buffer;
    if (existsSync(`${path}/${params.date}/index.md`)) {
      mdFile = await readFile(`${path}/${params.date}/index.md`);
      return { success: true, md: mdFile.toString() };
    }
    else if (existsSync('./client/template.md')) {
      mdFile = await readFile('./client/template.md');
      return { success: true, md: mdFile.toString() };
    }
    return { success: true, md: 'No file to read' };
  } catch (err) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'toString' in err
    ) {
      return { success: false, md: err.toString() };
    }
    return { success: false, md: 'Unknown Error' };

  }
};
