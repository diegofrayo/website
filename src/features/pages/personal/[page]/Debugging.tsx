import * as React from "react";

import { Block, Pre, Space } from "~/components/primitive";
import { ENV_VARS } from "~/constants";
import { AnalyticsService } from "~/features/analytics";
import { AuthService } from "~/features/auth";
import { getErrorsLogsHistory } from "~/features/errors-logging";
import { useDidMount } from "~/hooks";
import { isBrowser, isDevelopmentEnvironment, isLocalhostEnvironment, isServer } from "~/utils/app";
import {
	getAndroidVersion,
	getScreenSize,
	isAndroid,
	isMobileDevice,
	isPWA,
	isSmallScreen,
	is_iOS_AndMobileDevice,
} from "~/utils/browser";
import type { T_ReactElement } from "~/types";

function Debugging(): T_ReactElement {
	// states & refs
	const [content, setContent] = React.useState<{ vars: string; errors: string[] }>({
		vars: "",
		errors: [],
	});

	// effects
	useDidMount(() => {
		setContent({
			vars: JSON.stringify(
				{
					browser: {
						isAndroid: isAndroid(),
						getAndroidVersion: getAndroidVersion(),
						navigator: window.navigator.appVersion,
					},
					device: {
						is_iOS_AndMobileDevice: is_iOS_AndMobileDevice(),
						isMobileDevice: isMobileDevice(),
					},
					screen: {
						getScreenSize: getScreenSize(),
						isSmallScreen: isSmallScreen(),
					},
					env: ENV_VARS,
					session: {
						"AnalyticsService.isAnalyticsDisabled": AnalyticsService.isAnalyticsDisabled(),
						"AuthService.isUserLoggedIn": AuthService.isUserLoggedIn(),
					},
					misc: {
						isPWA: isPWA(),
						isServer: isServer(),
						isBrowser: isBrowser(),
						isLocalhostEnvironment: isLocalhostEnvironment(),
						isDevelopmentEnvironment: isDevelopmentEnvironment(),
					},
				},
				undefined,
				2,
			),
			errors: getErrorsLogsHistory(),
		});
	});

	return (
		<Block>
			<Pre variant={Pre.variant.STYLED}>{content.vars}</Pre>
			<Space size={3} />
			<Pre variant={Pre.variant.STYLED}>{content.errors.join("\n\n--- /// ---\n\n")}</Pre>
		</Block>
	);
}

export default Debugging;
