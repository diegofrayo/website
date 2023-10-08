import { renderIf } from "~/hocs";
import { isBrowser } from "~/utils/app";
import { LocalStorageManager } from "@diegofrayo/storage";
import type DR from "@diegofrayo/types";

// --- SERVICE ---

class AuthServiceClass {
	#isUserLoggedIn = false;

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
			this.#isUserLoggedIn = false;
			this.#LS_AUTH.remove();
		} else if (startSession) {
			this.#isUserLoggedIn = true;
			this.#LS_AUTH.set(this.#isUserLoggedIn);
		} else if (this.#LS_AUTH.exists()) {
			this.#isUserLoggedIn = this.#LS_AUTH.get();
		}
	}

	isUserLoggedIn() {
		return this.#isUserLoggedIn;
	}
}

export const AuthService = new AuthServiceClass();

// --- HOC ---

export function withAuth<G_ComponentProps extends object>(
	Component: DR.React.FunctionComponent<G_ComponentProps>,
): DR.React.FunctionComponent<G_ComponentProps> {
	return renderIf(Component)(() => AuthService.isUserLoggedIn());
}
