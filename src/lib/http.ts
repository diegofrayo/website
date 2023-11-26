import axios, { AxiosResponse } from "axios";

import { readDevToolsConfig } from "~/features/development-tools";
import { logAndReportError } from "~/features/logging";
import v from "~/lib/v";
import { isBrowser, isLocalhostEnvironment } from "~/utils/app";
import { showToast } from "~/utils/browser";

axios.interceptors.request.use((config) => {
	if (
		isLocalhostEnvironment() &&
		isBrowser() &&
		readDevToolsConfig().httpRequestsHaveToFail === true
	) {
		throw new Error("httpRequestsHaveToFail is enabled");
	}

	return {
		...config,
		headers: {
			"dfr-ua-browser": isBrowser(),
			...config.headers,
		},
	};
});

axios.interceptors.response.use(
	function AxiosSuccessResponseInterceptor(response) {
		if (isBrowser()) {
			const cacheKey = getCacheKey(response);

			if (v.isNotEmptyString(cacheKey)) {
				window.localStorage.setItem(cacheKey, JSON.stringify(response.data));
			}
		}

		return response;
	},
	function AxiosFailureResponseInterceptor(error) {
		logAndReportError(error, "AxiosFailureResponseInterceptor");

		if (isBrowser()) {
			const cacheKey = getCacheKey(error.response || { config: error.config });
			const cachedData = window.localStorage.getItem(cacheKey);

			if (v.isNotEmptyString(cachedData)) {
				showToast({
					type: "ALERT",
					message: "Data loaded from cache",
				});

				return Promise.resolve({ data: JSON.parse(cachedData) });
			}
		}

		return Promise.reject(error);
	},
);

const http = axios;

export default http;

// --- UTILS ---

function getCacheKey(response: AxiosResponse): string {
	return response?.config?.headers["dfr-local-cache"] || "";
}

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
