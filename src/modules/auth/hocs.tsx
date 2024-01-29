import * as React from "react";

import { renderIf } from "~/hocs";
import ServerAPI from "~/modules/api";
import { isProductionEnvironment } from "~/utils/app";
import { useDidMount } from "@diegofrayo/hooks";
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
	requireSecurityPin?: boolean;
	requireRemoteSecurityPin?: boolean;
	requireAuth: true;
	requireNoAuth?: never;
}
interface I_OptionsRequireNoAuth {
	requireSecurityPin?: boolean;
	requireRemoteSecurityPin?: boolean;
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
			checkConfig();
		});

		// --- UTILS ---
		async function checkConfig() {
			const isValidSecurityPin = await checkSecurityPinConfig();

			if ("requireAuth" in options) {
				redirectUser(AuthService.isUserLoggedIn() === false || !isValidSecurityPin);
			} else {
				redirectUser(AuthService.isUserLoggedIn() || !isValidSecurityPin);
			}
		}

		async function checkSecurityPinConfig() {
			if (isProductionEnvironment()) {
				if (options.requireSecurityPin === true) {
					const securityPinSession = BrowserStorageManager.createItem({
						key: "DR_LOCAL_SECURITY_SESSION",
						value: false,
						readInitialValueFromStorage: true,
						storage: "sessionStorage",
					});
					const isActiveSession = securityPinSession.get() === true;

					if (isActiveSession) {
						return false;
					}

					const LOCAL_SECURITY = "1256";
					const pin = window.prompt("Type the security pin");
					const pinMatched = pin === LOCAL_SECURITY;
					securityPinSession.set(pinMatched);

					return pinMatched;
				}
				if (options.requireRemoteSecurityPin === true) {
					try {
						const pinMatched = (
							await ServerAPI.post<boolean>("/security-pin", {
								path: window.location.pathname,
								securityPin: window.prompt("Type the security pin"),
							})
						).data;

						return pinMatched;
					} catch (error) {
						return false;
					}
				}
			}

			return false;
		}

		function redirectUser(hasToRedirect: boolean) {
			if (hasToRedirect) {
				goBack();
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
