import type { NextApiRequest, NextApiResponse } from "next";

import EnvVars from "~/modules/env-vars";

import { HttpError } from "../../errors";
import { sendServerError } from "../../utils";
import { parseRequestBody } from "./schemas";

export default async function isrHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { securityPin } = parseRequestBody(req.body);

		if (securityPin !== EnvVars.SECURITY_PIN) {
			throw new HttpError({
				id: "WRONG_SECURITY_PIN",
				message: "Wrong security pin",
				type: HttpError.types.BAD_REQUEST,
			});
		}

		res.send(true);
	} catch (error) {
		sendServerError(res, error);
	}
}
