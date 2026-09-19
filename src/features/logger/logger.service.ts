import { BrowserStorageManager } from "@diegofrayo-pkg/browser-storage";
import { isServer } from "@diegofrayo-pkg/validator";

const Logs = BrowserStorageManager.createItem<string[]>({
	key: "DR_LOGS",
	value: [],
	saveDuringCreation: true,
});

export default function logger(type: "LOG" | "WARN" | "ERROR", ...args: unknown[]): void {
	// eslint-disable-next-line no-console
	console[type === "LOG" ? "log" : type === "WARN" ? "warn" : "error"](...args);
}

export function logForRemoteDebugging(input: unknown, source?: string): void {
	logger("LOG", input);

	if (isServer()) return;

	persistLog(source, input);
}

export function logAndReportError(error: unknown, source?: string): void {
	logger("ERROR", error);

	if (isServer()) return;

	const parsedError =
		error instanceof Error
			? `${error.message} | ${error.stack}`
			: typeof error === "string"
				? error
				: "Unknown error";
	persistLog(source, parsedError);
}

export function addGlobalErrorListener(): void {
	// eslint-disable-next-line max-params
	window.onerror = function onerror(msg, url, lineNo, columnNo, error): boolean {
		logAndReportError(
			` ${msg} \n ${url} \n ${lineNo} \n ${columnNo} \n ${error} `,
			"window.onerror",
		);

		return false;
	};
}

export function getLogsHistory(): string[] {
	return Logs.get();
}

export function clearLogsHistory(): void {
	Logs.remove();
}

// --- UTILS ---

function persistLog(source: string | undefined, content: unknown): void {
	Logs.set(
		[`LOG: ${source || "No source"} | ${new Date()}: \n ${content}`].concat(
			Logs.get().splice(0, 49),
		),
	);
}
