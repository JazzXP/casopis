import type { PageServerLoad, RequestEvent } from './$types';
import dayjs from "dayjs";
import { loadMD, uploadImage, writeMD, entries } from '$lib/io/io';

const path = process.env.FILEPATH ?? './public/files';

export const actions = {
  upload: async (event: RequestEvent) => uploadImage(event),
  writeMD: async (event: RequestEvent) => writeMD(event),
};

export const load: PageServerLoad = async ({ params }) => {
  const today = dayjs(Date.now()).format("YYYYMMDD");
  const md = await loadMD(params.date, today);
  const allEntries = await entries(path);
  if (md) {
    return { success: true, md, entries: allEntries };
  }
  return { success: false, md: 'Unknown Error' };
};
