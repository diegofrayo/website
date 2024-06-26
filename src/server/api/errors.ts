/* eslint max-classes-per-file: 0 */

import v from "@diegofrayo/v";

export abstract class CustomError extends Error {
	constructor(
		public id: string,
		public message: string,
		public statusCode: number,
		public cause?: unknown,
	) {
		super(message);
		this.cause = v.isObject(cause)
			? {
					message: cause["message"],
					...cause,
				}
			: this.cause;
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
