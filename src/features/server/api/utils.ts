import { NextResponse } from "next/server";
import { ValiError } from "valibot";

import { CustomError } from "./errors";

export function sendServerError(error: unknown): NextResponse {
	const response = createServerErrorMessage(error);
	console.error(error);
	console.error(response);

	return NextResponse.json(response, { status: getStatusCode(error) });
}

function getStatusCode(error: unknown): number {
	if (error instanceof CustomError) {
		return error.statusCode;
	}

	if (error instanceof ValiError) {
		return 400;
	}

	return 500;
}

function createServerErrorMessage(error: unknown):
	| {
			message: string;
			id: string;
			statusCode: number;
			name: string;
			stack?: string;
			cause?: unknown;
	  }
	| { message: string; cause: string } {
	if (error instanceof CustomError) {
		return { ...error, message: error.message };
	}

	if (error instanceof ValiError) {
		return { message: "Ooops, bad request, check the form values", cause: error.message };
	}

	return {
		message: "Ooops, something went wrong :(",
		cause: error instanceof Error ? error.message : "",
	};
}
