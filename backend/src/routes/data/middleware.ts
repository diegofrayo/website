import HttpError from "~/exceptions/HttpError";
import envVars from "~/modules/env";
import type { T_NextFunction, T_Request, T_Response } from "~/types";

import { isPrivateModel } from "./utils";

const privateDataProtectionMiddleware = (
	req: T_Request,
	res: T_Response,
	next: T_NextFunction,
): void => {
	if (
		isPrivateModel(req.body.model) === false ||
		(isPrivateModel(req.body.model) &&
			req.headers["dfr-private-data-protection-token"] === envVars.PRIVATE_DATA_PROTECTION_TOKEN)
	) {
		next();
	} else {
		res.sendError(
			new HttpError({
				type: HttpError.types.UNAUTHORIZED,
				description: "private data token is wrong",
			}),
		);
	}
};

export default privateDataProtectionMiddleware;
