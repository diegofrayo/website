import http from "~/lib/http";

export async function dataLoader({ path }: { path: string }): Promise<unknown> {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${path}`);

  return data;
}
