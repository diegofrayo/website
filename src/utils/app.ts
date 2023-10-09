import EnvVars from "~/modules/env-vars";
import { LocalStorageManager } from "@diegofrayo/storage";

export function isDevelopmentEnvironment(): boolean {
	return (
		(isBrowser() ? window.location.href : EnvVars.NEXT_PUBLIC_WEBSITE_URL).includes(
			"vercel.app",
		) === false
	);
}

export function isLocalhostEnvironment(): boolean {
	const url = isBrowser() ? window.location.href : EnvVars.NEXT_PUBLIC_WEBSITE_URL;
	return url.includes("localhost") || url.includes("192.");
}

export function isBrowser(): boolean {
	return typeof window !== "undefined";
}

export function isServer(): boolean {
	return !isBrowser();
}

export function recoverFromBreakingChanges() {
	const LS_BreakingChanges = LocalStorageManager.createItem({
		key: "DR_BREAKING_CHANGES",
		value: "",
		saveWhenCreating: true,
		readInitialValueFromStorage: true,
	});
	const BREAKING_CHANGES = [
		"Mon Oct 02 2023 15:29:15",
		"Mon Oct 02 2023 16:30:15",
		"Mon Oct 02 2023 16:59:15",
	];
	const lastBreakingChange = BREAKING_CHANGES.at(-1) as string;
	const thereAreBreakingChanges = LS_BreakingChanges.get() !== lastBreakingChange;

	if (thereAreBreakingChanges) {
		window.localStorage.clear();
		LS_BreakingChanges.set(lastBreakingChange);
		window.location.reload();
	}
}
