import { logger } from "~/utils/app";

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

	const parsedError =
		error instanceof Error
			? `${error.message} | ${error.stack}`
			: typeof error === "string"
			? error
			: "Unknown error";

	window.localStorage.setItem(
		LOCAL_STORAGE_KEY,
		JSON.stringify([
			`${source || "No source"} | ${new Date()}: \n ${parsedError}`,
			...getErrorsLogsHistory(),
		]),
	);
}

export function getErrorsLogsHistory(): string[] {
	try {
		return JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || "---");
	} catch (error) {
		return [];
	}
}

export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;

	return "Unknown error";
}
