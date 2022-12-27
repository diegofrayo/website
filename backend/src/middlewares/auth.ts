import envVars from "~/utils/env";
import type { T_NextFunction, T_Request, T_Response } from "~/types";

function authMiddleware(req: T_Request, _: T_Response, next: T_NextFunction): void {
	const authToken = req.headers.authorization?.replace("Bearer ", "") || "";

	if (authToken === envVars.AUTH_TOKEN) {
		// req["isAuth"] = true;
	}

	next();
}

export default [authMiddleware];
