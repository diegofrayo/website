import AppError from "~/exceptions/AppError";
import v from "~/lib/validator";
import envVars from "~/modules/env";
import { logger } from "~/modules/logger";
import type { T_ErrorMiddleware, T_Object, T_Response } from "~/types";

// --- Middleware ---

const errorHandler: T_ErrorMiddleware = (err, req, res, next) => {
	logger("log", "errorHandlerMiddleware", req.baseUrl);

	const errorResponse = getError(err, res);
	logError(errorResponse);

	if (res.headersSent) {
		next(errorResponse);
		return;
	}

	res.status(errorResponse.statusCode).format({
		"application/json": () => {
			res.json(errorResponse.body);
		},
		default: () => {
			res.type("text/plain").send(errorResponse.body.error_description);
		},
	});
};

export const errorHandlerMiddleware = [errorHandler];

// --- Uncaught errors ---

process.on("uncaughtException", (error: Error) => {
	logger("error", `Uncaught Exception: ${error.message}`);
	logError(getError(error));
});

process.on("exit", () => {
	logger("error", ".exit() handler");
});

// --- Utils ---

export function getError(error: AppError | Error | unknown, res?: T_Response): T_ResponseError {
	if (error instanceof AppError) {
		const result: T_ResponseError = {
			statusCode: isErrorStatusCode(error.statusCode) ? error.statusCode : 500,
			body: {
				error: error.id,
				error_description: error.description,
			},
		};

		if (envVars.isDevelopment) {
			result.body.details = {
				stack: error.stack || "",
				cause: error.cause || "",
			};
		}

		return result;
	}

	if (error instanceof Error) {
		return {
			statusCode: res && isErrorStatusCode(res.statusCode) ? res.statusCode : 500,
			body: envVars.isDevelopment
				? {
						error: "server_error",
						error_description: error.message,
						details: {
							stack: error.stack || "",
							cause: (error as unknown as T_Object)["cause"] || "",
						},
				  }
				: {
						error: "server_error",
						error_description: "Something went wrong",
				  },
		};
	}

	logger("warn", "Unknown error that could not be identified by errorHandlerMiddleware", error);

	return {
		statusCode: 500,
		body: {
			error: "unhandled_error",
			error_description: "Something went wrong",
		},
	};
}

function logError(error: T_ResponseError): void {
	logger("error", {
		...error,
		body: {
			...error.body,
			details: JSON.stringify(error.body.details || {}),
		},
	});
}

function isErrorStatusCode(statusCode: unknown): statusCode is number {
	if (v.isNumber(statusCode)) {
		return statusCode >= 400 && statusCode < 600;
	}

	return false;
}

// --- Types ---

type T_ResponseError = {
	statusCode: NonNullable<AppError["statusCode"]>;
	body: {
		error: AppError["id"];
		error_description: AppError["description"];
		details?: {
			stack?: AppError["stack"];
			cause?: AppError["cause"];
		};
	};
};