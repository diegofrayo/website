import AppError from "./AppError";

export default class ServerError extends AppError {
	constructor({
		id = "server_error",
		description = "Something went wrong",
		cause,
	}: Partial<AppError>) {
		super(id, description, 500, cause);
	}
}
