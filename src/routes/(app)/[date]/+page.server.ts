import fs from 'fs/promises';

import type { PageServerLoad, RequestEvent } from './$types';
import fsSync from 'fs';
import dayjs from "dayjs";
import { loadMD, uploadImage, writeMD } from '$lib/io/io';

const path = process.env.FILEPATH ?? './public/files';

export const actions = {
  upload: async (event: RequestEvent) => uploadImage(event, fs),
  writeMD: async (event: RequestEvent) => writeMD(event, fs),
};

export const load: PageServerLoad = async ({ params }) => {
  const today = dayjs(Date.now()).format("YYYYMMDD");
  const md = await loadMD(params.date, today, fs, fsSync);
  if (md) {
    return { success: true, md };
  }
  return { success: false, md: 'Unknown Error' };
};
