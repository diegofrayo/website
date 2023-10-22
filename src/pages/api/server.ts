import type { NextApiRequest, NextApiResponse } from "next";
import signInHandler from "~/server/api/handlers/sign-in";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const { $_ACTION } = req.body;

	switch ($_ACTION) {
		case "/sign-in":
			signInHandler(req, res);
			break;

		default:
			res.status(400).json({ message: `Invalid action: "${$_ACTION}"` });
			break;
	}
}
