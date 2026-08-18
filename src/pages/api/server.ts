import type { NextApiRequest, NextApiResponse } from "next";

import checkSessionHandler from "~/features/server/api/endpoints/check-session/handler";
import isrHandler from "~/features/server/api/endpoints/isr/handler";
import signInHandler from "~/features/server/api/endpoints/sign-in/handler";
import signOutHandler from "~/features/server/api/endpoints/sign-out/handler";
import { sendServerError } from "~/features/server/api/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { $_ACTION } = req.body;

	switch ($_ACTION) {
		case "POST/isr":
			await isrHandler(req, res);
			break;

		case "POST/sign-in":
			await signInHandler(req, res);
			break;

		case "POST/check-session":
			await checkSessionHandler(req, res);
			break;

		case "POST/sign-out":
			await signOutHandler(req, res);
			break;

		default:
			sendServerError(res, { statusCode: 400, message: `Invalid action: "${$_ACTION}"` });
			break;
	}
}
