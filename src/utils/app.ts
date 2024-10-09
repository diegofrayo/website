import type DR from "@diegofrayo/types";
import { isBrowser, throwError } from "@diegofrayo/utils/misc";

export function isDevelopmentEnvironment(EnvVars?: DR.Object<string>) {
	return (isBrowser() ? window.location.href : getWebsiteURL(EnvVars)).includes(".dev") === false;
}

export function isProductionEnvironment(EnvVars?: DR.Object<string>) {
	return isDevelopmentEnvironment(EnvVars) === false || EnvVars?.["NODE_ENV"] === "production";
}

export function isLocalhostEnvironment(EnvVars?: DR.Object<string>) {
	const url = isBrowser() ? window.location.href : getWebsiteURL(EnvVars);
	return url.includes("localhost") || url.includes("127.0.0.1");
}

export function isRemoteLocalhostEnvironment(EnvVars?: DR.Object<string>) {
	const url = isBrowser() ? window.location.href : getWebsiteURL(EnvVars);
	return url.includes("192.");
}

// --- INTERNALS ---

function getWebsiteURL(EnvVars?: DR.Object<string>) {
	return (
		(EnvVars ? EnvVars["NEXT_PUBLIC_WEBSITE_URL"] : process.env["NEXT_PUBLIC_WEBSITE_URL"]) ||
		throwError(
			`Invalid "NEXT_PUBLIC_WEBSITE_URL" value: "${process.env["NEXT_PUBLIC_WEBSITE_URL"]}"`,
		)
	);
}
