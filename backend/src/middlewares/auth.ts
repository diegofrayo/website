import envVars from "~/modules/env";
import type { T_NextFunction, T_Request, T_Response } from "~/types";

function authMiddleware(req: T_Request, _: T_Response, next: T_NextFunction): void {
	const authToken = req.headers.authorization?.replace("Bearer ", "") || "";

	req.session.isUserLoggedIn = authToken === envVars.AUTH_TOKEN;

	next();
}

export default [authMiddleware];
