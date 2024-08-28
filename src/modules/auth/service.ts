import { BrowserStorageManager } from "@diegofrayo/storage";
import { isBrowser } from "@diegofrayo/utils/misc";
import { isRemoteLocalhostEnvironment } from "~/utils/app";

import { logger } from "../logging";
import { redirect, ROUTES } from "../routing";
import type { T_Role } from "./types";

class AuthServiceClass {
	#isUserLoggedIn = false;

	#role: T_Role = "ANONYMOUS";

	#AXIOS_VA = "1.6.2";

	#AXIOS_VG = "1.6.3";

	#LBC = "1724814162596";

	#BS_AUTH = BrowserStorageManager.createItem({
		key: "axios_client_development",
		value: ["", ""],
		saveWhileInitialization: false,
		readInitialValueFromStorage: true,
	});

	constructor() {
		if (isBrowser()) {
			this.loadSession();
		}
	}

	loadSession() {
		try {
			const [role, sessionTimestamp] = this.#BS_AUTH.get();

			if (role === this.#AXIOS_VA) {
				this.#role = "ADMIN";
				this.#isUserLoggedIn = true;
			} else if (role === this.#AXIOS_VG) {
				this.#role = "GUEST";
				this.#isUserLoggedIn = true;
			} else {
				this.#isUserLoggedIn = isRemoteLocalhostEnvironment();
			}

			const isOutdatedSession = this.#isUserLoggedIn && sessionTimestamp < this.#LBC;
			if (isOutdatedSession) {
				this.signOut();
			}
		} catch (error) {
			logger("ERROR", error);
			this.signOut();
		}
	}

	createSession() {
		this.#isUserLoggedIn = true;
		this.#BS_AUTH.set([this.#AXIOS_VA, `${Date.now()}`]);
		this.#role = "ADMIN";
	}

	destroySession() {
		this.#isUserLoggedIn = false;
		this.#role = "ANONYMOUS";
		this.#BS_AUTH.remove();
	}

	isUserLoggedIn() {
		return this.#isUserLoggedIn;
	}

	getRole() {
		return this.#role;
	}

	isAnonymousUser() {
		return this.#isUserLoggedIn === false && this.#role === "ANONYMOUS";
	}

	isGuestUser() {
		return this.#isUserLoggedIn === true && this.#role === "GUEST";
	}

	isAdminUser() {
		return this.#isUserLoggedIn === true && this.#role === "ADMIN";
	}

	switchToAdminUser() {
		this.createSession();
	}

	switchToGuestUser() {
		this.#isUserLoggedIn = true;
		this.#BS_AUTH.set([this.#AXIOS_VG, `${Date.now()}`]);
		this.#role = "GUEST";
	}

	signOut() {
		this.destroySession();
		redirect(ROUTES.HOME);
	}
}

const AuthService = new AuthServiceClass();

export default AuthService;
