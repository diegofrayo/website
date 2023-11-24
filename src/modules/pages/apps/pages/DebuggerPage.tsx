import * as React from "react";

import { MainLayout, Page } from "~/components/layout";
import { Block, Button, Pre, Space, Title } from "~/components/primitive";
import { SourceCode } from "~/components/shared";
import { useDidMount } from "@diegofrayo/hooks";
import AnalyticsService from "~/modules/analytics";
import { AuthService, withAuthRulesPage } from "~/modules/auth";
import EnvVars from "~/modules/env-vars";
import { clearLogsHistory, getLogsHistory } from "~/modules/logging";
import {
	isDevelopmentEnvironment,
	isLocalhostEnvironment,
	isProductionEnvironment,
	isRemoteLocalhostEnvironment,
} from "~/utils/app";
import {
	getAndroidVersion,
	getScreenSize,
	isAndroid,
	isMobileDevice,
	isPWA,
	isSmallScreen,
	is_iOS_AndMobileDevice,
} from "@diegofrayo/utils/browser";
import { isBrowser, isServer } from "@diegofrayo/utils/misc";
import v from "@diegofrayo/v";

function DebuggerPage() {
	// --- STATES & REFS ---
	const [content, setContent] = React.useState<{ info: string; logs: string[] }>({
		info: "",
		logs: [],
	});

	// --- EFFECTS ---
	useDidMount(() => {
		setContent({
			info: JSON.stringify(
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
					env: EnvVars,
					session: {
						"AnalyticsService.isAnalyticsDisabled": AnalyticsService.isAnalyticsDisabled(),
						"AuthService.isUserLoggedIn": AuthService.isUserLoggedIn(),
					},
					misc: {
						isPWA: isPWA(),
						isServer: isServer(),
						isBrowser: isBrowser(),
						isLocalhostEnvironment: isLocalhostEnvironment(EnvVars),
						isProductionEnvironment: isProductionEnvironment(EnvVars),
						isDevelopmentEnvironment: isDevelopmentEnvironment(EnvVars),
						isRemoteLocalhostEnvironment: isRemoteLocalhostEnvironment(EnvVars),
					},
				},
				undefined,
				2,
			),
			logs: getLogsHistory(),
		});
	});

	// --- HANDLERS ---
	function handleClearLogsClick() {
		clearLogsHistory();
		setContent((currentState) => ({ ...currentState, logs: [] }));
	}

	return (
		<Page
			config={{
				title: "Debugger",
				disableSEO: true,
			}}
		>
			<MainLayout title="Debugger">
				<Block>
					<Title
						variant={Title.variant.STYLED}
						is="h2"
					>
						Info
					</Title>
					<Space size={1} />
					<SourceCode code={content.info} />

					{v.isNotEmptyArray(content.logs) ? (
						<Block>
							<Space size={6} />

							<Title
								variant={Title.variant.STYLED}
								is="h2"
							>
								Logs
							</Title>
							<Space size={1} />

							<Pre
								variant={Pre.variant.BREAK_WITH_BLANK_SPACES}
								className="tw-h-80 tw-overflow-auto tw-rounded-md tw-border tw-p-4 tw-text-base dr-bg-color-surface-200 dr-border-color-surface-300"
							>
								{content.logs.join("\n\n--- /// ---\n\n")}
							</Pre>
							<Space size={1} />

							<Button
								variant={Button.variant.STYLED}
								className="tw-ml-auto tw-block"
								onClick={handleClearLogsClick}
							>
								clear logs
							</Button>
						</Block>
					) : null}
				</Block>
			</MainLayout>
		</Page>
	);
}

export default withAuthRulesPage(DebuggerPage, { requireAuth: true });
