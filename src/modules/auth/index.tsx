import * as React from "react";

import { renderIf } from "~/hocs";
import { useDidMount } from "~/hooks";
import { LocalStorageManager } from "@diegofrayo/storage";
import { isBrowser } from "@diegofrayo/utils/misc";
import type DR from "@diegofrayo/types";

import { ROUTES, redirect } from "../routing";

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

type T_Options =
	| {
			requireAuth: true;
			requireNoAuth?: never;
	  }
	| {
			requireNoAuth: true;
			requireAuth?: never;
	  };

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
				redirectUser(AuthService.isUserLoggedIn() === false);
			} else {
				redirectUser(AuthService.isUserLoggedIn());
			}
		});

		// --- UTILS ---
		function redirectUser(hasToRedirect: boolean): void {
			if (hasToRedirect) {
				redirect(ROUTES.HOME);
			} else {
				setAllowRender(true);
			}
		}

		if (allowRender) {
			return <Component {...props} />;
		}

		return null;
	};
}
