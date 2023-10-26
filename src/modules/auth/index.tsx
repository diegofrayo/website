import * as React from "react";

import { renderIf } from "~/hocs";
import { useDidMount } from "~/hooks";
import { isProductionEnvironment } from "~/utils/app";
import { LocalStorageManager } from "@diegofrayo/storage";
import type DR from "@diegofrayo/types";
import { isBrowser } from "@diegofrayo/utils/misc";

import { goBack } from "../routing";

// --- SERVICE ---

class AuthServiceClass {
	#isUserLoggedIn = false;

	#LS_AUTH = LocalStorageManager.createItem({
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
		this.#isUserLoggedIn = this.#LS_AUTH.get();
	}

	createSession() {
		this.#isUserLoggedIn = true;
		this.#LS_AUTH.set(this.#isUserLoggedIn);
	}

	destroySession() {
		this.#isUserLoggedIn = false;
		this.#LS_AUTH.remove();
	}

	isUserLoggedIn() {
		return this.#isUserLoggedIn;
	}
}

export const AuthService = new AuthServiceClass();

// --- HOCS ---

export function withAuth<G_ComponentProps extends object>(
	Component: DR.React.FunctionComponent<G_ComponentProps>,
): DR.React.FunctionComponent<G_ComponentProps> {
	return renderIf(Component)(() => AuthService.isUserLoggedIn());
}

interface I_OptionsRequireAuth {
	requirePin?: boolean;
	requireAuth: true;
	requireNoAuth?: never;
}
interface I_OptionsRequireNoAuth {
	requirePin?: boolean;
	requireNoAuth: true;
	requireAuth?: never;
}

type T_Options = I_OptionsRequireAuth | I_OptionsRequireNoAuth;

export function withAuthRulesPage<G_ComponentProps extends object>(
	Component: DR.React.FunctionComponent<G_ComponentProps>,
	options: T_Options,
): DR.React.FunctionComponent<G_ComponentProps> {
	return function WithAuthComponent(props: G_ComponentProps) {
		// --- STATES & REFS ---
		const [allowRender, setAllowRender] = React.useState(false);

		// --- EFFECTS ---
		useDidMount(() => {
			if ("requireAuth" in options) {
				redirectUser(AuthService.isUserLoggedIn() === false || checkSecurityPinConfig());
			} else {
				redirectUser(AuthService.isUserLoggedIn() || checkSecurityPinConfig());
			}
		});

		// --- UTILS ---
		function redirectUser(hasToRedirect: boolean): void {
			if (hasToRedirect) {
				goBack();
			} else {
				setAllowRender(true);
			}
		}

		function checkSecurityPinConfig() {
			if (options.requirePin === true && isProductionEnvironment()) {
				const SECURITY_PIN = "1256";
				const pin = window.prompt("Type the security pin");

				return pin !== SECURITY_PIN;
			}

			return false;
		}

		if (allowRender) {
			return <Component {...props} />;
		}

		return null;
	};
}
