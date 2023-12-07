import { isRemoteLocalhostEnvironment } from "~/utils/app";
import { BrowserStorageManager } from "@diegofrayo/storage";
import { isBrowser } from "@diegofrayo/utils/misc";

class AuthServiceClass {
	#isUserLoggedIn = false;

	#BS_AUTH = BrowserStorageManager.createItem({
		key: "DR_AUTH",
		value: false,
		saveWhenCreating: false,
		readInitialValueFromStorage: true,
	});

	constructor() {
		if (isBrowser()) {
			this.loadSession();
		}
	}

	loadSession() {
		this.#isUserLoggedIn = isRemoteLocalhostEnvironment() ? true : this.#BS_AUTH.get();
	}

	createSession() {
		this.#isUserLoggedIn = true;
		this.#BS_AUTH.set(this.#isUserLoggedIn);
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
}

const AuthService = new AuthServiceClass();

export default AuthService;
