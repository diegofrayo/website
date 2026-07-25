import { isBrowser } from "../validator";
import { throwError } from "./errors";

const WEBSITE_DOMAIN = getWebsiteDomain();

export function isDevelopmentEnvironment(): boolean {
	return (
		WEBSITE_DOMAIN.includes(".local") ||
		WEBSITE_DOMAIN.includes("//localhost") ||
		WEBSITE_DOMAIN.includes("//127.0.0.1") ||
		WEBSITE_DOMAIN.includes("//192.")
	);
}

export function isProductionEnvironment(): boolean {
	return isDevelopmentEnvironment() === false && process.env["NODE_ENV"] === "production";
}

export function isRemoteLocalhostEnvironment(): boolean {
	// TODO: [regex] Use a regex instead of a static string
	return WEBSITE_DOMAIN.includes("//192.");
}

// --- UTILS ---

function getWebsiteDomain(): string {
	if (isBrowser()) {
		return window.location.href;
	}

	if (process.env["NEXT_PUBLIC_WEBSITE_URL"]) {
		return process.env["NEXT_PUBLIC_WEBSITE_URL"];
	}

	if (process.env["WEBSITE_URL"]) {
		return process.env["WEBSITE_URL"];
	}

	throwError(
		`You need to set either NEXT_PUBLIC_WEBSITE_URL or WEBSITE_URL as env vars to perform the environment validations at the server-side`,
	);
}
