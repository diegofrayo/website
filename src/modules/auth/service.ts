import { isRemoteLocalhostEnvironment } from "~/utils/app";
import { BrowserStorageManager } from "@diegofrayo/storage";
import { isBrowser } from "@diegofrayo/utils/misc";

class AuthServiceClass {
	#isUserLoggedIn = false;

	#LOGGED_IN_NUMBER = "1.6.2";

	#BS_AUTH = BrowserStorageManager.createItem({
		key: "axios_client_development",
		value: "",
		saveWhileInitialization: false,
		readInitialValueFromStorage: true,
	});

	constructor() {
		if (isBrowser()) {
			this.loadSession();
		}
	}

	loadSession() {
		this.#isUserLoggedIn = isRemoteLocalhostEnvironment()
			? true
			: this.#BS_AUTH.get() === this.#LOGGED_IN_NUMBER;
	}

	createSession() {
		this.#isUserLoggedIn = true;
		this.#BS_AUTH.set(this.#LOGGED_IN_NUMBER);
	}

	destroySession() {
		this.#isUserLoggedIn = false;
		this.#BS_AUTH.remove();
	}

	isUserLoggedIn() {
		return this.#isUserLoggedIn;
	}

	isGuestUser() {
		return this.#isUserLoggedIn === false;
	}

	createTemporalSession() {
		this.#isUserLoggedIn = true;
	}

	destroyTemporalSession() {
		this.#isUserLoggedIn = false;
	}
}

const AuthService = new AuthServiceClass();

export default AuthService;
