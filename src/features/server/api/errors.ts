/* eslint max-classes-per-file: 0 */

import { isPlainObject } from "@diegofrayo-pkg/validator";

export abstract class CustomError extends Error {
	id: string;
	statusCode: number;

	constructor(id: string, message: string, statusCode: number, cause?: unknown) {
		super(message);
		this.id = id;
		this.message = message;
		this.statusCode = statusCode;
		this.cause = isPlainObject(cause) ? { ...cause, message: cause["message"] } : this.cause;
	}
}

export class ServerError extends CustomError {
	constructor(message: string) {
		super("ServerError", message, 500);
	}
}

export class HttpError extends CustomError {
	static types = {
		OK: { name: "OK", statusCode: 200 },
		NO_CONTENT: { name: "NO_CONTENT", statusCode: 204 },
		BAD_REQUEST: { name: "BAD_REQUEST", statusCode: 400 },
		UNAUTHORIZED: { name: "UNAUTHORIZED", statusCode: 401 },
		NOT_FOUND: { name: "NOT_FOUND", statusCode: 404 },
		INTERNAL_SERVER_ERROR: { name: "INTERNAL_SERVER_ERROR", statusCode: 500 },
	};

	constructor({
		id,
		message,
		type,
	}: {
		id: string;
		message: string;
		type: (typeof HttpError.types)[keyof typeof HttpError.types];
	}) {
		super(id, message, type.statusCode);
	}
}
