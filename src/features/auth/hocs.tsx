import * as React from "react";

import { renderIf } from "~/hocs";
import { useDidMount } from "~/hooks";
import { readDevToolsConfig } from "~/features/development-tools";
import { redirect as globalRedirect, ROUTES } from "~/features/routing";
import { isLocalhostEnvironment } from "~/utils/app";
import { isNotTrue } from "~/utils/validations";
import type { T_ReactElementNullable, T_ReactFunctionComponent, T_UnknownObject } from "~/types";

import AuthService from "./service";

export function withAuthPage<G_ComponentProps = T_UnknownObject>(
	Component: T_ReactFunctionComponent<G_ComponentProps>,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	options?: { denyLoggedIn?: boolean; allowIf?: (props: G_ComponentProps) => boolean }, // WARN: False positive
): T_ReactFunctionComponent<G_ComponentProps> {
	return function WithAuthComponent(props: G_ComponentProps): T_ReactElementNullable {
		// states & refs
		const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(false);

		// effects
		useDidMount(() => {
			if (isLocalhostEnvironment() && isNotTrue(readDevToolsConfig().authPagesEnabled)) {
				redirect(false);
				return;
			}

			if (options?.allowIf && options?.allowIf(props)) {
				redirect(false);
			} else if (options?.denyLoggedIn) {
				redirect(AuthService.isUserLoggedIn());
			} else {
				redirect(AuthService.isUserLoggedIn() === false);
			}
		});

		// utils
		function redirect(predicate: boolean): void {
			if (predicate) {
				globalRedirect(ROUTES.HOME);
				return;
			}

			setIsUserLoggedIn(true);
		}

		if (isUserLoggedIn) {
			return <Component {...props} />;
		}

		return null;
	};
}

export function withAuthComponent<G_ComponentProps>(
	WrappedComponent: T_ReactFunctionComponent<G_ComponentProps>,
): T_ReactFunctionComponent<G_ComponentProps> {
	return renderIf(WrappedComponent)(() => AuthService.isUserLoggedIn());
}