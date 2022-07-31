export function readDevToolsConfig(): T_DevToolsConfig {
	try {
		const config = JSON.parse(
			window.localStorage.getItem("DFR_DEV_TOOLS") || "---",
		) as T_DevToolsConfig;

		return config;
	} catch (error) {
		return {} as T_DevToolsConfig;
	}
}

export function updateDevToolsConfig(updatedConfig: Partial<T_DevToolsConfig>): void {
	window.localStorage.setItem(
		"DFR_DEV_TOOLS",
		JSON.stringify({
			...readDevToolsConfig(),
			...updatedConfig,
		}),
	);
}

// --- Types ---

type T_DevToolsConfig = {
	isUserLoggedIn: boolean;
	isDevelopmentEnvironment: boolean;
	isCSSDebuggingEnabled: boolean;
	httpRequestsHaveToFail: boolean;
};
