import HttpError from "~/exceptions/HttpError";
import envVars from "~/modules/env";
import v from "~/lib/validator";
import type { T_NextFunction, T_Request, T_Response } from "~/types";

function basicResourcesProtectionMiddleware(
	req: T_Request,
	res: T_Response,
	next: T_NextFunction,
): void {
	// TODO: Remove this later, when sessionMiddleware is enabled again
	if (v.isUndefined(req.session)) req.session = { isUserLoggedIn: false };

	if (
		req.headers["dfr-basic-resources-protection-token"] ===
			envVars.BASIC_RESOURCES_PROTECTION_TOKEN ||
		resourceIsInWhitelist(req.originalUrl)
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

// --- Utils ---

function resourceIsInWhitelist(url: string): boolean {
	const WHITELIST = ["/static/", "/tests/"];

	for (const item of WHITELIST) {
		if (url.startsWith(item)) {
			return true;
		}
	}

	return false;
}
