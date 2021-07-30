import http from "~/utils/http";
import { isDevelopmentEnvironment } from "~/utils/misc";

export async function loader({ path }) {
  if (process.env.NEXT_PUBLIC_IS_OWNER) {
    if (isDevelopmentEnvironment()) {
      const response = await http.get(`${process.env.NEXT_PUBLIC_ASSETS_SERVER}/${path}`);

      return response.data;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require("fs");
  const response = fs.readFileSync(
    `${process.cwd()}/${process.env.NEXT_PUBLIC_ASSETS_PATH}/${path}`,
    "utf8",
  );

  return response;
}
