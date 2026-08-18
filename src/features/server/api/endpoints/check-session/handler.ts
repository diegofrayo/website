import type { NextApiRequest, NextApiResponse } from "next";

import { EnvVars } from "~/constants";
import { getAuthCookie, verifyAuthToken } from "~/features/auth/auth.server";

import { HttpError } from "../../errors";
import { sendServerError } from "../../utils";

export default async function checkSessionHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const cookie = getAuthCookie(req);

		if (!cookie) {
			return res.json({ signedIn: false });
		}

		const { authToken } = await verifyAuthToken(cookie).catch(() => {
			throw new HttpError({
				id: "CHECK_SESSION_INVALID_COOKIE",
				message: "Invalid or expired session",
				type: HttpError.types.UNAUTHORIZED,
			});
		});

		if (authToken !== EnvVars.AUTH_TOKEN) {
			throw new HttpError({
				id: "CHECK_SESSION_WRONG_AUTH_TOKEN",
				message: "Invalid session",
				type: HttpError.types.UNAUTHORIZED,
			});
		}

		res.json({ signedIn: true });
	} catch (error) {
		sendServerError(res, error);
	}
}
