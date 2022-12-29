// eslint-disable-next-line import/prefer-default-export
export function logger(type: "log" | "error" | "warn", ...content: unknown[]): void {
	console[type](...content); // eslint-disable-line no-console
}
