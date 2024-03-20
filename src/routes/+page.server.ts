import { entries } from '$lib/io/io';
import type { PageServerLoad } from './$types';

const path = process.env.FILEPATH ?? './public/files';

export const load: PageServerLoad = async ({ params }) => {
  const allEntries = await entries(path);
  return { success: true, entries: allEntries };
};
