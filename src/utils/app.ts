import { ENV_VARS } from "~/constants";
import { readDevToolsConfig } from "~/features/development-tools";

export function isDevelopmentEnvironment(): boolean {
	if (isLocalhostEnvironment() && isBrowser()) {
		return readDevToolsConfig().isDevelopmentEnvironment === true;
	}

	return (
		(isBrowser() ? window.location.href : ENV_VARS.NEXT_PUBLIC_WEBSITE_URL).includes(
			"vercel.app",
		) === false
	);
}

export function isLocalhostEnvironment(): boolean {
	const url = isBrowser() ? window.location.href : ENV_VARS.NEXT_PUBLIC_WEBSITE_URL;
	return url.includes("localhost") || url.includes("192.");
}

export function isBrowser(): boolean {
	return typeof window !== "undefined";
}

export function isServer(): boolean {
	return !isBrowser();
}

export function logger(type: "LOG" | "WARN" | "ERROR", ...args: unknown[]): void {
	console[type === "LOG" ? "log" : type === "WARN" ? "warn" : "error"](...args);
}
