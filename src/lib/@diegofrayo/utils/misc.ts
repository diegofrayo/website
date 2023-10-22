import v from "../v";

export function throwError(message: string): never {
	throw new Error(message);
}

export function getErrorMessage(error: unknown): string {
	if (isHttpError(error)) {
		return error.response.data.message;
	}

	if (error instanceof Error) {
		return error.message;
	}

	if (typeof error === "string") {
		return error;
	}

	return "Unknown error";
}

export function isBrowser(): boolean {
	return typeof window !== "undefined";
}

export function isServer(): boolean {
	return !isBrowser();
}

// --- INTERNALS ---

type T_HttpError = { response: { data: { message: string } } };

function isHttpError(error: unknown): error is T_HttpError {
	return v.isString((error as T_HttpError).response?.data?.message);
}
