import http from "~/lib/http";
import { ASSETS_LOCAL_PATH } from "~/utils/constants";

export async function dataLoader({ path }: { path: string }): Promise<unknown> {
  if (process.env.NEXT_PUBLIC_IS_OWNER) {
    const response = await http.get(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}${path}`);

    return response.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require("fs");
  const response = fs.readFileSync(`${process.cwd()}/${ASSETS_LOCAL_PATH}/${path}`, "utf8");

  return response;
}
