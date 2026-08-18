import type { NextApiRequest, NextApiResponse } from "next";

import { EnvVars } from "~/constants";
import { setAuthCookie, signAuthToken } from "~/features/auth/auth.server";

import { HttpError } from "../../errors";
import { sendServerError } from "../../utils";
import { parseRequestBody } from "./schemas";

export default async function signInHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { authToken } = parseRequestBody(req.body);

		if (authToken !== EnvVars.AUTH_TOKEN) {
			throw new HttpError({
				id: "SIGN_IN_WRONG_AUTH_TOKEN",
				message: "Wrong auth token",
				type: HttpError.types.UNAUTHORIZED,
			});
		}

		const token = await signAuthToken(authToken);
		setAuthCookie(res, token);

		res.json({ signedIn: true, date: new Date() });
	} catch (error) {
		sendServerError(res, error);
	}
}
