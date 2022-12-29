import v from "~/lib/validator";
import envVars from "~/modules/env";
import type { T_NextFunction, T_Request, T_Response } from "~/types";

function authMiddleware(req: T_Request, _: T_Response, next: T_NextFunction): void {
	if (readAuthToken(req.headers.authorization) === envVars.AUTH_TOKEN) {
		req.session.isUserLoggedIn = true;
	}

	next();
}

export default [authMiddleware];

// --- Utils ---

function readAuthToken(authorization: unknown): string {
	if (v.isString(authorization)) {
		return authorization.replace("Bearer ", "");
	}

	return "";
}
