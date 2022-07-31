import axios from "axios";

import { readDevToolsConfig } from "~/features/development-tools";
import { isBrowser, isLocalhostEnvironment } from "~/utils/app";

axios.interceptors.request.use((config) => {
	return {
		...config,
		headers: {
			...config.headers,
			"dfr-ua-browser": isBrowser(),
		},
	};
});

axios.interceptors.request.use(
	(config) => {
		if (
			isLocalhostEnvironment() &&
			isBrowser() &&
			readDevToolsConfig().httpRequestsHaveToFail === true
		) {
			throw new Error("httpRequestsHaveToFail is enabled");
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

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
