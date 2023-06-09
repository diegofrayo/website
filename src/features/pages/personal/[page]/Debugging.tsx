import * as React from "react";

import { Block, Button, Pre, Space } from "~/components/primitive";
import { ENV_VARS } from "~/constants";
import { AnalyticsService } from "~/features/analytics";
import { AuthService } from "~/features/auth";
import { clearLogsHistory, getLogsHistory } from "~/features/logging";
import { useDidMount } from "~/hooks";
import v from "~/lib/v";
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
	// --- STATES & REFS ---
	const [content, setContent] = React.useState<{ vars: string; logs: string[] }>({
		vars: "",
		logs: [],
	});

	// --- EFFECTS ---
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
			logs: getLogsHistory(),
		});
	});

	// --- HANDLERS ---
	function handleClearLogsClick(): void {
		clearLogsHistory();
		window.location.reload();
	}

	return (
		<Block>
			<Pre variant={Pre.variant.STYLED}>{content.vars}</Pre>
			{v.isNotEmptyArray(content.logs) ? (
				<React.Fragment>
					<Space size={3} />
					<Pre variant={Pre.variant.STYLED}>{content.logs.join("\n\n--- /// ---\n\n")}</Pre>
					<Space size={0.5} />
					<Button
						variant={Button.variant.DEFAULT}
						className="tw-ml-auto tw-block"
						onClick={handleClearLogsClick}
					>
						clear logs
					</Button>
				</React.Fragment>
			) : null}
		</Block>
	);
}

export default Debugging;
