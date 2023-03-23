import { goto } from "$app/navigation";

export default async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const resp = await fetch(input, init);
  console.log(resp.status);
  if (resp.status === 300) {
    console.log(await resp.text());
    goto(await resp.text());
  }
  return resp;
};