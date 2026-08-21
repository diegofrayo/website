import type { NextRequest } from "next/server";

import checkSessionHandler from "~/features/server/api/endpoints/check-session/handler";
import signInHandler from "~/features/server/api/endpoints/sign-in/handler";
import signOutHandler from "~/features/server/api/endpoints/sign-out/handler";
import { sendServerError } from "~/features/server/api/utils";

export async function POST(req: NextRequest) {
	const { $_ACTION, ...body } = await req.json().catch(() => ({ $_ACTION: undefined }));

	switch ($_ACTION) {
		case "POST/sign-in":
			return signInHandler(body);

		case "POST/check-session":
			return checkSessionHandler(req);

		case "POST/sign-out":
			return signOutHandler();

		default:
			return sendServerError({ statusCode: 400, message: `Invalid action: "${$_ACTION}"` });
	}
}
