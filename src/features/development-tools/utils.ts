const LOCAL_STORAGE_KEY = "DFR_DEV_TOOLS";
const DEFAULT_VALUES = {
	isUserLoggedIn: false,
	isDevelopmentEnvironment: true,
	isCSSDebuggingEnabled: false,
	httpRequestsHaveToFail: false,
	authPagesEnabled: true,
};

export function initDevToolsConfig(): void {
	if (window.localStorage.getItem(LOCAL_STORAGE_KEY)) return;

	updateDevToolsConfig(DEFAULT_VALUES);
}

export function readDevToolsConfig(): T_DevToolsConfig {
	try {
		const config = JSON.parse(
			window.localStorage.getItem(LOCAL_STORAGE_KEY) || "---",
		) as T_DevToolsConfig;

		return config;
	} catch (error) {
		return DEFAULT_VALUES;
	}
}

export function updateDevToolsConfig(updatedConfig: Partial<T_DevToolsConfig>): void {
	window.localStorage.setItem(
		LOCAL_STORAGE_KEY,
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
	authPagesEnabled: boolean;
};
