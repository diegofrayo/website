import envVars from "~/modules/env";
import type { T_NextFunction, T_Request, T_Response } from "~/types";

function basicResourcesProtectionMiddleware(
	req: T_Request,
	res: T_Response,
	next: T_NextFunction,
): void {
	if (
		req.headers["dfr-basic-resources-protection-token"] === envVars.BASIC_RESOURCES_PROTECTION_TOKEN
	) {
		next();
	} else {
		// TODO: Custom error
		res.status(404).send("Auth error");
	}
}

export default [basicResourcesProtectionMiddleware];
