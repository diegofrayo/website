export function throwError(message: string) {
	throw new Error(message);
}

export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;

	return "Unknown error";
}