import { isServer } from "~/utils/app";
import { LocalStorageManager } from "@diegofrayo/storage";

const LS_Logs = LocalStorageManager.createItem<string[]>({
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

export function clearLogsHistory(): void {
	LS_Logs.remove();
}

// --- INTERNALS ---

function addLog(source: string | undefined, content: unknown) {
	LS_Logs.set(
		[`LOG: ${source || "No source"} | ${new Date()}: \n ${content}`].concat(LS_Logs.get()),
	);
}
