import type { RequestEvent } from "./$types";
import jwt from 'jsonwebtoken';
import { readFile } from "fs/promises";

export const actions = {
  login: async ({ request }: RequestEvent) => {
    const data = await request.formData();
    const signKey = await readFile(`./jwtkey_private.pem`);
    if (data.get('password') === 'abc123') {
      console.log('Successful Password');
      const token = jwt.sign({ loggedIn: true, exp: Math.floor(Date.now() / 1000) + (60 * 60), }, signKey, { algorithm: 'RS512' });
      return {
        success: true,
        token,
      };
    };
    console.log('Bad Password');
    return { success: false };
  }
};