import AppError from "~/exceptions/AppError";
import v from "~/lib/validator";
import envVars from "~/modules/env";
import { logger } from "~/modules/logger";
import type { T_ErrorMiddleware, T_NextFunction, T_Object, T_Request, T_Response } from "~/types";

// --- Middleware ---

const errorHandler: T_ErrorMiddleware = (err, req, res, next) => {
	logger("log", "Custom error handler", req.baseUrl);

	if (res.headersSent) {
		next(err);
		return;
	}

	const errorResponse = getError(err, res);
	logError(errorResponse);

	res.status(errorResponse.statusCode).format({
		"application/json": () => {
			res.json(errorResponse.body);
		},
		default: () => {
			res.type("text/plain").send(errorResponse.body.message);
		},
	});
};

export const errorHandlerMiddleware = [errorHandler];

// --- Uncaught errors ---

process.on("uncaughtException", (error: Error) => {
	logger("error", `Uncaught Exception: ${error.message}`);
	errorHandler(error, {} as T_Request, {} as T_Response, (() => undefined) as T_NextFunction);
});

// --- Utils ---

function getError(error: Error | AppError | T_Object, res: T_Response): T_ResponseError {
	if (error instanceof AppError) {
		return {
			statusCode: error.statusCode,
			body: {
				message: error.message,
				details: {
					id: error.id,
					type: error.type,
				},
				...(envVars.isDevelopment ? { stack: error.stack } : {}),
			},
		};
	}

	if (error instanceof Error) {
		return {
			statusCode: isErrorStatusCode(res.statusCode) ? res.statusCode : 500,
			body: envVars.isDevelopment
				? {
						message: error.message,
						stack: error.stack,
				  }
				: {
						message: "Something went wrong",
				  },
		};
	}

	logger("warn", "Unknown error that could not be identified by errorHandlerMiddleware", error);

	return {
		statusCode: 500,
		body: {
			message: "Something went wrong",
		},
	};
}

function logError(error: T_ResponseError): void {
	logger("error", error);
}

function isErrorStatusCode(statusCode: unknown): statusCode is number {
	if (v.isNumber(statusCode)) {
		return statusCode >= 400 && statusCode < 600;
	}

	return false;
}

// --- Types ---

type T_ResponseError = {
	statusCode: number;
	body: {
		message: string;
		stack?: Error["stack"] | undefined;
		details?: T_Object;
	};
};
