import AppError from "./AppError";

export default class ServerError extends AppError {
	constructor(message: string) {
		super(message, 500, "SERVER_ERROR", "SVR1");
	}
}
