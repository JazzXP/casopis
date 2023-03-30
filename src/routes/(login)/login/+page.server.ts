import type { RequestEvent } from "./$types";
import jwt from 'jsonwebtoken';
import { readFile } from "fs/promises";

export const actions = {
  login: async ({ request, cookies }: RequestEvent) => {
    const data = await request.formData();
    const signKey = await readFile(`./jwtkey_private.pem`);
    if (data.get('password') === process.env.PASSWORD) {
      const token = jwt.sign({ loggedIn: true, }, signKey, { algorithm: 'RS512', expiresIn: '30 days', });
      cookies.set('token', token, {
        maxAge: 60 * 60 * 24 * 30, // one month
      });
      return {
        status: 201,
        body: {
          success: true,
        }
      };
    };
    return { body: { success: false } };
  },
};