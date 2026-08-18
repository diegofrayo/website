import autoBind from "auto-bind";

import api from "~/api/client";

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
			const hasUserSession = await api.website.actions.checkSession();
			this.#isUserLoggedIn = hasUserSession;
		} catch (error) {
			this.#isUserLoggedIn = false;
		} finally {
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
}

const AuthService = new AuthServiceClass();

export default AuthService;
