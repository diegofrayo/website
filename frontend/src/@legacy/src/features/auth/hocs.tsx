import * as React from "react";

import { renderIf } from "~/@legacy/src/hocs";
import { useDidMount } from "~/@legacy/src/hooks";
import v from "~/@legacy/src/lib/v";
import { readDevToolsConfig } from "~/@legacy/src/features/development-tools";
import { redirect as globalRedirect, ROUTES } from "~/@legacy/src/features/routing";
import { isLocalhostEnvironment } from "~/@legacy/src/utils/app";
import type { T_ReactElementNullable, T_ReactFunctionComponent } from "~/@legacy/src/types";

import AuthService from "./service";

export function withAuthPage<G_ComponentProps extends object>(
	Component: T_ReactFunctionComponent<G_ComponentProps>,
	options?: { denyLoggedIn?: boolean; allowIf?: (props: G_ComponentProps) => boolean },
): T_ReactFunctionComponent<G_ComponentProps> {
	return function WithAuthComponent(props: G_ComponentProps): T_ReactElementNullable {
		// states & refs
		const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(false);

		// effects
		useDidMount(() => {
			if (isLocalhostEnvironment() && v.isNotTrue(readDevToolsConfig().authPagesEnabled)) {
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

export function withAuthComponent<G_ComponentProps extends object>(
	WrappedComponent: T_ReactFunctionComponent<G_ComponentProps>,
): T_ReactFunctionComponent<G_ComponentProps> {
	return renderIf(WrappedComponent)(() => AuthService.isUserLoggedIn());
}