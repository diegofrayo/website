import axios, { AxiosResponse } from "axios";

import { ENV_VARS } from "~/constants";
import { readDevToolsConfig } from "~/features/development-tools";
import { logAndReportError } from "~/features/errors-logging";
import { isBrowser, isLocalhostEnvironment } from "~/utils/app";
import { showToast } from "~/utils/browser";
import { isNotEmptyString } from "~/utils/validations";

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
			Authorization: `Bearer ${ENV_VARS.TOKEN_FOR_PROTECTED_RESOURCES_BE}`,
			"dfr-ua-browser": isBrowser(),
			...config.headers,
		},
	};
});

axios.interceptors.response.use(
	function AxiosSuccessResponseInterceptor(response) {
		if (isBrowser()) {
			const cacheKey = getCacheKey(response);

			if (isNotEmptyString(cacheKey)) {
				window.localStorage.setItem(cacheKey, JSON.stringify(response.data));
			}
		}

		return response;
	},
	function AxiosFailureResponseInterceptor(error) {
		logAndReportError(error, "AxiosFailureResponseInterceptor");

		if (isBrowser()) {
			const cacheKey = getCacheKey(error.response);
			const cachedData = window.localStorage.getItem(cacheKey);

			if (isNotEmptyString(cachedData)) {
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

export default axios;

// --- Utils ---

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
