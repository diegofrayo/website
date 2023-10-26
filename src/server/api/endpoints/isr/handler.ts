import type { NextApiRequest, NextApiResponse } from "next";

import EnvVars from "~/modules/env-vars";

import { HttpError } from "../../errors";
import { sendServerError } from "../../utils";
import { parseRequestBody } from "./schemas";

export default async function isrHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { path, secret } = parseRequestBody(req.body);

		if (secret !== EnvVars.ISR_SECURITY_PIN) {
			throw new HttpError({
				id: "ISR_WRONG_SECURITY_PIN",
				message: "Wrong security pin",
				type: HttpError.types.BAD_REQUEST,
			});
		}

		await res.revalidate(path);
		res.json({ revalidated: true, date: new Date() });
	} catch (error) {
		sendServerError(res, error);
	}
}
