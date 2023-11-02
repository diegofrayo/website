import { BrowserStorageManager } from "@diegofrayo/storage";
import { isServer } from "@diegofrayo/utils/misc";

const BS_Logs = BrowserStorageManager.createItem<string[]>({
	key: "DR_LOGS",
	value: [],
	saveWhenCreating: true,
});

export function logger(type: "LOG" | "WARN" | "ERROR", ...args: unknown[]): void {
	// eslint-disable-next-line no-console
	console[type === "LOG" ? "log" : type === "WARN" ? "warn" : "error"](...args);
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
	addLog(source, parsedError);
}

export function logForRemoteDebugging(input: unknown, source?: string): void {
	logger("LOG", input);

	if (isServer()) {
		return;
	}

	addLog(source, input);
}

export function addErrorsGlobalListener(): void {
	window.onerror = function onerror(msg, url, lineNo, columnNo, error): boolean {
		logAndReportError(
			` ${msg} \n ${url} \n ${lineNo} \n ${columnNo} \n ${error} `,
			"window.onerror",
		);

		return false;
	};
}

export function getLogsHistory() {
	return BS_Logs.get();
}

export function clearLogsHistory(): void {
	BS_Logs.remove();
}

// --- INTERNALS ---

function addLog(source: string | undefined, content: unknown) {
	BS_Logs.set(
		[`LOG: ${source || "No source"} | ${new Date()}: \n ${content}`].concat(BS_Logs.get()),
	);
}
