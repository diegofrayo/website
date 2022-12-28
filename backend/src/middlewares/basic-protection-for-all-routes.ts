import envVars from "~/modules/env";
import type { T_NextFunction, T_Request, T_Response } from "~/types";

function basicProtectionForAllRoutesMiddleware(
	req: T_Request,
	res: T_Response,
	next: T_NextFunction,
): void {
	if (req.headers.authorization?.includes(envVars.PROTECT_ALL_RESOURCES_TOKEN)) {
		next();
	} else {
		res.status(404).send("Auth error");
	}
}

export default [basicProtectionForAllRoutesMiddleware];
