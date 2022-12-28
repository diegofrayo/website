import envVars from "~/modules/env";
import type { T_NextFunction, T_Request, T_Response } from "~/types";

import { isPrivateModel } from "./utils";

const dataControllerMiddleware = (req: T_Request, res: T_Response, next: T_NextFunction): void => {
	if (isPrivateModel(req.body.model)) {
		if (req.headers.authorization?.includes(envVars.PROTECT_SOME_DATA_TOKEN)) {
			next();
		} else {
			res.send("Error");
		}
	} else {
		next();
	}
};

export default [dataControllerMiddleware];
