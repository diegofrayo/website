import envVars from "~/modules/env";
import type { T_Middleware, T_NextFunction, T_Request, T_Response } from "~/types";

function environmentProtectionMiddleware(environment: "dev" | "prod"): T_Middleware {
	return function innerEnvironmentProtectionMiddleware(
		_: T_Request,
		__: T_Response,
		next: T_NextFunction,
	): void {
		if (
			(environment === "dev" && envVars.isDevelopment) ||
			(environment === "prod" && envVars.isProduction)
		) {
			next();
		} else {
			// TODO
			next(new Error("Environment wrong"));
		}
	};
}

export default environmentProtectionMiddleware;
