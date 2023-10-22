import type { NextApiResponse } from "next";
import { ValiError } from "valibot";

import HttpError from "./errors";

export function sendServerError(res: NextApiResponse, error: unknown) {
	res.status(getStatusCode(error)).json(createServerErrorMessage(error));
}

function getStatusCode(error: unknown) {
	if (error instanceof HttpError) {
		return error.statusCode;
	}

	if (error instanceof ValiError) {
		return 400;
	}

	return 500;
}

function createServerErrorMessage(error: unknown) {
	if (error instanceof HttpError) {
		return { ...error, message: error.message };
	}

	if (error instanceof ValiError) {
		return { message: "Ooops, bad request, check the form values" };
	}

	return { message: "Ooops, something went wrong :(" };
}
