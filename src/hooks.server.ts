import { redirect } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import jwt from 'jsonwebtoken';

export const handle = async ({ event, resolve }) => {
  if (!event.url.pathname.startsWith('/login')) {
    // Check cookie
    const token = event.cookies.get('token');
    if (!(await validateToken(token))) {
      throw redirect(300, '/login');
    }
  }
  const response = await resolve(event);
  return response;
};

const validateToken = async (token?: string) => {
  if (token === undefined || token.length === 0) return false;

  try {
    return (
      jwt.verify(token, await readFile(`./jwtkey_public.pem`), { algorithms: ['RS512'] }) !== null
    );
  } catch (err) {
    console.error(err);
    console.error('Invalid Token');
    return false;
  }
};
