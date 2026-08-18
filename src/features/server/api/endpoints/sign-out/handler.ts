import type { NextApiRequest, NextApiResponse } from "next";

import { clearAuthCookie } from "~/features/auth/auth.server";

import { sendServerError } from "../../utils";

export default async function signOutHandler(_req: NextApiRequest, res: NextApiResponse) {
	try {
		clearAuthCookie(res);

		res.json({ signedOut: true });
	} catch (error) {
		sendServerError(res, error);
	}
}
