import autoBind from "auto-bind";

import http from "~/lib/http";
import v from "~/lib/v";
import { isBrowser } from "~/utils/app";

class AuthService {
	private LOCAL_STORAGE_KEY = "DFR_AUTH";

	constructor() {
		autoBind(this);
	}

	isUserLoggedIn(): boolean {
		return true;
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
