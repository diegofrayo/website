import v from "~/lib/validator";
import envVars from "~/modules/env";
import { logger } from "~/modules/logger";
import type { T_ErrorMiddleware, T_Object, T_Response } from "~/types";

const errorHandlerMiddleware: T_ErrorMiddleware = (err, req, res, next) => {
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
			res.type("text/plain").send(errorResponse.body);
		},
	});
};

export default [errorHandlerMiddleware];

// --- Utils ---

function getError(error: Error | T_Object, res: T_Response): T_ResponseError {
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

	return {
		statusCode: isErrorStatusCode(error["statusCode"]) ? error["statusCode"] : 500,
		body: envVars.isDevelopment
			? {
					message: error["message"] as string,
					stack: error["stack"] as string,
			  }
			: {
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
	};
};

/*
class CharacterCountExceeded extends Error { // parent error
  constructor(post_id, content) {
      super();
      this.name = this.constructor.name // good practice

      if (this instanceof LongTitleError) // checking if title or body
          this.type = 'title'
      else if (this instanceof LongBodyError)
          this.type = 'body'

    this.message = `The character count of post (id: ${post_id}) ${this.type} is too long. (${content.length} characters)` // detailed error message
    this.statusCode = 500 // error code for responding to client
  }
}

// extending to child error classes
class LongTitleError extends CharacterCountExceeded { }
class LongBodyError extends CharacterCountExceeded { }

module.exports = {
    CharacterCountExceeded,
    LongTitleError,
    LongBodyError
}
*/
