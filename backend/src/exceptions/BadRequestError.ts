import AppError from "./AppError";

export default class BadRequestError extends AppError {
	constructor(message: string) {
		super(message, 400, "BAD_REQUEST_ERROR", "BR1");
	}
}
