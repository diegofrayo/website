import axios from "axios";

export default axios;

/*
import axios from "axios";

import { T_Object } from "~/types";

export default {
  ...axios,
  post: function post(
    url: string,
    body: T_Object,
    config = { timeout: 5000 },
  ): Promise<{ data: any }> {
    let controller: AbortController | null = new AbortController();

    setTimeout(() => {
      if (!controller) return;
      controller.abort();
    }, config.timeout);

    return axios.post(url, { signal: controller.signal, body }).then((response) => {
      controller = null;
      return response;
    });
  },
};
*/
