import HttpError from "~/exceptions/HttpError";
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
		res.sendError(
			new HttpError({
				type: HttpError.types.UNAUTHORIZED,
				description: "basic protection token is missing or is wrong",
			}),
		);
	}
}

export default [basicResourcesProtectionMiddleware];
