import autoBind from "auto-bind";

import { ENV_VARS } from "~/constants";
import { readDevToolsConfig } from "~/features/development-tools";
import http from "~/lib/http";
import v from "~/lib/v";
import { isBrowser, isLocalhostEnvironment } from "~/utils/app";
import type { T_Object } from "~/types";

class AuthService {
	private LOCAL_STORAGE_KEY = "DFR_AUTH";

	constructor() {
		autoBind(this);
	}

	async signIn(values: T_Object): Promise<void> {
		return http
			.post(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
				path: "/auth",
				payload: values,
			})
			.then(({ data }: { data: { token: string } }) => {
				window.localStorage.setItem(this.LOCAL_STORAGE_KEY, data.token);
			})
			.catch((error): never => {
				throw error.response || error;
			});
	}

	isUserLoggedIn(): boolean {
		if (isLocalhostEnvironment() && isBrowser()) {
			return readDevToolsConfig().isUserLoggedIn === true;
		}

		return v.isNotEmptyString(this.getToken());
	}

	isSignInError(error: unknown): error is T_SignInError {
		if (v.isObject(error)) {
			return v.isNotEmptyString((error as T_SignInError).data?.code);
		}

		return false;
	}

	configureHTTPHeaders(): void {
		http.interceptors.request.use((config) => ({
			...config,
			headers: {
				...config.headers,
				...(this.isUserLoggedIn()
					? {
							Authorization: `Bearer ${this.getToken()}`,
					  }
					: {}),
			},
		}));
	}

	private getToken(): string {
		return isBrowser() ? window.localStorage.getItem(this.LOCAL_STORAGE_KEY) || "" : "";
	}
}

export default new AuthService();

// --- TYPES ---

type T_SignInError = {
	data: {
		code: "AUTH_WRONG_PASSWORD";
	};
};
