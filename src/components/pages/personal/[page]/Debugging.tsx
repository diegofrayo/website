import * as React from "react";

import { Pre } from "~/components/primitive";
import { AuthService } from "~/auth";
import { useDidMount } from "~/hooks";
import AnalyticsService from "~/services/analytics";
import { isBrowser, isDevelopmentEnvironment, isServer } from "~/utils/app";
import {
	getAndroidVersion,
	getScreenSize,
	isAndroid,
	isMobileDevice,
	isPWA,
	isSmallScreen,
	is_iOS_AndMobileDevice,
} from "~/utils/browser";
import { ENV_VARS } from "~/utils/constants";
import type { T_ReactElement } from "~/types";

function Debugging(): T_ReactElement {
	const [content, setContent] = React.useState("");

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
