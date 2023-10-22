import type { NextApiRequest, NextApiResponse } from "next";

import signInHandler from "~/server/api/endpoints/sign-in/handler";
import { sendServerError } from "~/server/api/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { $_ACTION } = req.body;

	switch ($_ACTION) {
		case "/sign-in":
			await signInHandler(req, res);
			break;

		default:
			sendServerError(res, { statusCode: 400, message: `Invalid action: "${$_ACTION}"` });
			break;
	}
}
