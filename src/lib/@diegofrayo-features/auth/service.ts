import { BrowserStorageManager } from "@diegofrayo-pkg/browser-storage";
import { isRemoteLocalhostEnvironment } from "@diegofrayo-pkg/utilities/environment";

import { logger } from "../logger";
import type { AuthUserRole } from "./types";

class AuthServiceClass {
	#isUserLoggedIn = false;

	#role: AuthUserRole = "ANONYMOUS";

	#AXIOS_VA = "1.6.2"; // NOTE: Used when the user is "ADMIN"

	#AXIOS_VG = "1.6.3"; // NOTE: Used when the user is "GUEST"

	#LBC = "1724814162596"; // NOTE: Update this when you are a breaking change

	#AUTH_CONFIG = BrowserStorageManager.createItem({
		key: "axios_client_development",
		value: ["", ""], // NOTE: [ROLE, TIMESTAMP]
		saveDuringCreation: false,
		readInitialValueFromStorage: true,
	});

	loadSession() {
		try {
			const [role, sessionTimestamp] = this.#AUTH_CONFIG.get();

			if (role === this.#AXIOS_VA) {
				this.#role = "ADMIN";
				this.#isUserLoggedIn = true;
			} else if (role === this.#AXIOS_VG) {
				this.#role = "GUEST";
				this.#isUserLoggedIn = true;
			} else if (isRemoteLocalhostEnvironment()) {
				this.#role = "ADMIN";
				this.#isUserLoggedIn = true;
			} else {
				this.#role = "ANONYMOUS";
				this.#isUserLoggedIn = false;
			}

			const isOutdatedSession =
				this.#isUserLoggedIn && sessionTimestamp && sessionTimestamp < this.#LBC;

			if (isOutdatedSession) {
				this.signOut();
			} else {
				window.dispatchEvent(new CustomEvent("SESSION_LOADED"));
			}
		} catch (error) {
			logger("ERROR", error);
			this.signOut();
		}
	}

	onLoadSession(callback: () => void) {
		window.addEventListener("SESSION_LOADED", callback, false);
	}

	createSession() {
		this.#role = "ADMIN";
		this.#isUserLoggedIn = true;
		this.#AUTH_CONFIG.set([this.#AXIOS_VA, `${Date.now()}`]);
	}

	destroySession() {
		this.#role = "ANONYMOUS";
		this.#isUserLoggedIn = false;
		this.#AUTH_CONFIG.remove();
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
		this.#role = "GUEST";
		this.#isUserLoggedIn = true;
		this.#AUTH_CONFIG.set([this.#AXIOS_VG, `${Date.now()}`]);
	}

	switchToAnonymousUser() {
		this.destroySession();
	}

	signOut(redirectPath?: string) {
		this.destroySession();
		window.location.href = redirectPath || "/";
	}
}

const AuthService = new AuthServiceClass();

export { AuthService };
