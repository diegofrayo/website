import * as React from "react";

import { renderIf } from "~/hocs";
import { useDidMount } from "@diegofrayo/hooks";
import { isProductionEnvironment } from "~/utils/app";
import { BrowserStorageManager } from "@diegofrayo/storage";
import type DR from "@diegofrayo/types";

import { goBack } from "../routing";
import AuthService from "./service";

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
				const securityPinSession = BrowserStorageManager.createItem({
					key: "DR_SECURITY_PIN_SESSION",
					value: false,
					readInitialValueFromStorage: true,
					storage: "sessionStorage",
				});
				const isActiveSession = securityPinSession.get() === true;

				if (isActiveSession) {
					return false;
				}

				const SECURITY_PIN = "1256";
				const pin = window.prompt("Type the security pin");
				const pinMatched = pin === SECURITY_PIN;
				securityPinSession.set(pinMatched);

				return pinMatched === false;
			}

			return false;
		}

		if (allowRender) {
			return <Component {...props} />;
		}

		return null;
	};
}
