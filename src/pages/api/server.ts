import type { NextApiRequest, NextApiResponse } from "next";

import dencryptHandler from "~/server/api/endpoints/dencrypt/handler";
import isrHandler from "~/server/api/endpoints/isr/handler";
import signInHandler from "~/server/api/endpoints/sign-in/handler";
import { sendServerError } from "~/server/api/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { $_ACTION } = req.body;

	switch ($_ACTION) {
		case "POST/sign-in":
			await signInHandler(req, res);
			break;

		case "POST/dencrypt":
			await dencryptHandler(req, res);
			break;

		case "POST/isr":
			await isrHandler(req, res);
			break;

		default:
			sendServerError(res, { statusCode: 400, message: `Invalid action: "${$_ACTION}"` });
			break;
	}
}
