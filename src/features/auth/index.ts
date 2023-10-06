import { renderIf } from "~/hocs";
import { isBrowser } from "~/utils/app";
import LocalStorageManager from "@diegofrayo/utils/local-storage";
import type DR from "@diegofrayo/types";

// --- SERVICE ---

class AuthServiceClass {
	#isLoggedIn = false;

	#LS_AUTH = LocalStorageManager.createItem({ key: "DR_AUTH", value: false });

	constructor() {
		if (isBrowser()) {
			this.init();
		}
	}

	init() {
		const urlQueryParams = window.location.search;
		const searchParams = new URLSearchParams(urlQueryParams);
		const closeSession = searchParams.get("auth") === "false";
		const startSession = searchParams.get("auth") === "true";

		if (closeSession) {
			this.#isLoggedIn = false;
			this.#LS_AUTH.remove();
		} else if (startSession) {
			this.#isLoggedIn = true;
			this.#LS_AUTH.set(this.#isLoggedIn);
		} else if (this.#LS_AUTH.exists()) {
			this.#isLoggedIn = this.#LS_AUTH.get();
		}
	}

	isLoggedIn() {
		return this.#isLoggedIn;
	}
}

export const AuthService = new AuthServiceClass();

// --- HOC ---

export function withAuth<G_ComponentProps extends object>(
	Component: DR.React.FunctionComponent<G_ComponentProps>,
): DR.React.FunctionComponent<G_ComponentProps> {
	return renderIf(Component)(() => AuthService.isLoggedIn());
}
