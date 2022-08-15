import * as React from "react";

import { Pre } from "~/components/primitive";
import { AuthService } from "~/features/auth";
import { useDidMount } from "~/hooks";
import { AnalyticsService } from "~/features/analytics";
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
import { ENV_VARS } from "~/constants";
import type { T_ReactElement } from "~/types";

function Debugging(): T_ReactElement {
	// states & refs
	const [content, setContent] = React.useState("");

	// effects
	useDidMount(() => {
		setContent(
			JSON.stringify(
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
		);
	});

	return <Pre variant={Pre.variant.STYLED}>{content}</Pre>;
}

export default Debugging;
