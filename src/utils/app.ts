import { isBrowser, throwError } from "@diegofrayo/utils/misc";
import type DR from "@diegofrayo/types";

export function isDevelopmentEnvironment(EnvVars?: DR.Object<string>): boolean {
	return (
		(isBrowser() ? window.location.href : getWebsiteURL(EnvVars)).includes("vercel.app") === false
	);
}

export function isProductionEnvironment(EnvVars?: DR.Object<string>): boolean {
	return isDevelopmentEnvironment(EnvVars) === false || EnvVars?.["NODE_ENV"] === "production";
}

export function isLocalhostEnvironment(EnvVars?: DR.Object<string>): boolean {
	const url = isBrowser() ? window.location.href : getWebsiteURL(EnvVars);
	return url.includes("localhost") || url.includes("192.");
}

// --- INTERNALS ---

function getWebsiteURL(EnvVars?: DR.Object<string>): string {
	return (
		(EnvVars ? EnvVars["NEXT_PUBLIC_WEBSITE_URL"] : process.env["NEXT_PUBLIC_WEBSITE_URL"]) ||
		throwError(
			`Invalid "NEXT_PUBLIC_WEBSITE_URL" value: "${process.env["NEXT_PUBLIC_WEBSITE_URL"]}"`,
		)
	);
}
