import AppError from "./AppError";

export default class HttpError extends AppError {
	static types = {
		OK: { code: 200, id: "OK" },
		NO_CONTENT: { code: 204, id: "NO_CONTENT" },
		BAD_REQUEST: { code: 400, id: "BAD_REQUEST" },
		UNAUTHORIZED: { code: 401, id: "UNAUTHORIZED" },
		NOT_FOUND: { code: 404, id: "NOT_FOUND" },
		INTERNAL_SERVER_ERROR: { code: 500, id: "INTERNAL_SERVER_ERROR" },
	};

	constructor({
		id,
		description,
		type,
		cause,
	}: Partial<Pick<AppError, "id">> &
		Pick<AppError, "description" | "cause"> & { type: { id: string; code: number } }) {
		super(id || type.id, description, type.code, cause);
	}
}
