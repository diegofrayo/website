import { useState } from "react";

import { BrowserStorageManager } from "@diegofrayo-pkg/browser-storage";
import { withConditionalRender } from "@diegofrayo-pkg/hocs";
import { useDidMount } from "@diegofrayo-pkg/hooks";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { isProductionEnvironment } from "@diegofrayo-pkg/utilities/environment";
import { goBack } from "@diegofrayo-pkg/utilities/navigation";

import { Box } from "../components/primitive";
import { AuthService } from "./service";
import type { AuthUserRole } from "./types";

export function withAuth<ComponentProps extends object>(
	Component: ReactTypes.FunctionComponent<ComponentProps>,
	roles?: AuthUserRole[],
): ReactTypes.FunctionComponent<ComponentProps> {
	return withConditionalRender(Component)(() => {
		return AuthService.isUserLoggedIn() && (roles ? roles.includes(AuthService.getRole()) : true);
	});
}

interface OptionsRequireAuth {
	requireSecurityPin?: boolean;
	requireAuth: true;
	roles?: AuthUserRole[];
	requireNoAuth?: never;
	redirectTo?: string;
}
interface OptionsRequireNoAuth {
	requireSecurityPin?: boolean;
	requireNoAuth: true;
	roles?: never;
	requireAuth?: never;
	redirectTo?: string;
}

type Options = OptionsRequireAuth | OptionsRequireNoAuth;

export function withAuthRulesPage<ComponentProps extends object>(
	Component: ReactTypes.FunctionComponent<ComponentProps>,
	options: Options,
): ReactTypes.FunctionComponent<ComponentProps> {
	return function WithAuthComponent(props: ComponentProps) {
		// --- STATE & REFS ---
		const [renderStatus, setRenderStatus] = useState<RenderStatus>("NO_RENDER");

		// --- EFFECTS ---
		useDidMount(() => {
			checkConfig();
		});

		// --- UTILS ---
		async function checkConfig() {
			if ("requireAuth" in options) {
				const hasPermissions = options.roles ? options.roles.includes(AuthService.getRole()) : true;

				if (!AuthService.isUserLoggedIn()) {
					redirect();
				} else if (!isValidSecurityPin() || !hasPermissions) {
					goBack();
				} else {
					setRenderStatus("RENDER");
				}
			} else {
				if (AuthService.isUserLoggedIn()) {
					redirect();
				} else {
					setRenderStatus("RENDER");
				}
			}
		}

		function isValidSecurityPin() {
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
						return true;
					}

					// NOTE: I know, this is very unsecure
					const LOCAL_SECURITY_PIN = "1256";
					const pin = window.prompt("Type the security pin");
					const pinMatched = pin === LOCAL_SECURITY_PIN;
					securityPinSession.set(pinMatched);

					return pinMatched;
				}
			}

			return true;
		}

		function redirect() {
			if (options.redirectTo) {
				window.location.href = options.redirectTo;
			} else {
				setRenderStatus("FORBIDDEN");
			}
		}

		if (renderStatus === "RENDER") {
			return <Component {...props} />;
		}

		if (renderStatus === "FORBIDDEN") {
			return <Box className="p-4">Access Forbidden!</Box>;
		}

		return null;
	};
}

// --- TYPES ---

type RenderStatus = "NO_RENDER" | "RENDER" | "FORBIDDEN";
