import { isServer } from "~/utils/app";

const LOCAL_STORAGE_KEY = "DFR_GLOBAL_ERRORS";

export function addErrorsGlobalListener(): void {
	window.onerror = function onerror(msg, url, lineNo, columnNo, error): boolean {
		logAndReportError(
			` ${msg} \n ${url} \n ${lineNo} \n ${columnNo} \n ${error} `,
			"window.onerror",
		);

		return false;
	};
}

export function logAndReportError(error: unknown, source?: string): void {
	logger("ERROR", error);

	if (isServer()) {
		return;
	}

	const parsedError =
		error instanceof Error
			? `${error.message} | ${error.stack}`
			: typeof error === "string"
			? error
			: "Unknown error";

	window.localStorage.setItem(
		LOCAL_STORAGE_KEY,
		JSON.stringify([
			`ERROR: ${source || "No source"} | ${new Date()}: \n ${parsedError}`,
			...getLogsHistory(),
		]),
	);
}

export function logForDebugging(input: unknown, source?: string): void {
	logger("LOG", input);

	if (isServer()) {
		return;
	}

	const parsedInput = input && typeof input === "object" ? JSON.stringify(input) : input;

	window.localStorage.setItem(
		LOCAL_STORAGE_KEY,
		JSON.stringify([
			`LOG: ${source || "No source"} | ${new Date()}: \n ${parsedInput}`,
			...getLogsHistory(),
		]),
	);
}

export function getLogsHistory(): string[] {
	try {
		return JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || "---");
	} catch (error) {
		return [];
	}
}

export function clearLogsHistory(): void {
	window.localStorage.removeItem(LOCAL_STORAGE_KEY);
}

export function logger(type: "LOG" | "WARN" | "ERROR", ...args: unknown[]): void {
	console[type === "LOG" ? "log" : type === "WARN" ? "warn" : "error"](...args);
}
