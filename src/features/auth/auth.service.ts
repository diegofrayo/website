import autoBind from "auto-bind";

import apiClient from "~/features/api-client";

import logger from "../logger";

class AuthServiceClass {
	#isUserLoggedIn: boolean = false;

	#isSessionLoaded: boolean = false;

	#onSessionLoadCallbacks: Array<(isUserLoggedIn: boolean) => void> = [];

	constructor() {
		autoBind(this);
	}

	async loadSession(): Promise<void> {
		if (this.#isSessionLoaded) return;

		try {
			const hasUserSession = await apiClient.website.auth.checkSession();
			this.#isUserLoggedIn = hasUserSession;
		} catch (error) {
			this.#isUserLoggedIn = false;
		} finally {
			logger("LOG", "🟢 Session loaded");
			this.#isSessionLoaded = true;
			this.#onSessionLoadCallbacks.forEach((callback) => {
				callback(this.#isUserLoggedIn);
			});
		}
	}

	onSessionLoad(callback: (isUserLoggedIn: boolean) => void): void {
		if (this.#isSessionLoaded) {
			callback(this.#isUserLoggedIn);
		} else {
			this.#onSessionLoadCallbacks.push(callback);
		}
	}

	isUserLoggedIn(): boolean {
		return this.#isUserLoggedIn;
	}

	signIn(authToken: string) {
		return apiClient.website.auth.signIn({ authToken });
	}

	signOut() {
		return apiClient.website.auth.signOut();
	}
}

const AuthService = new AuthServiceClass();

export default AuthService;
