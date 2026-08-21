import { NextResponse } from "next/server";

import { EnvVars } from "~/constants";
import { setAuthCookie, signAuthToken } from "~/features/auth/auth.server";

import { HttpError } from "../../errors";
import { sendServerError } from "../../utils";
import { parseRequestBody } from "./schemas";

export default async function signInHandler(body: unknown) {
	try {
		const { authToken } = parseRequestBody(body);

		if (authToken !== EnvVars.AUTH_TOKEN) {
			throw new HttpError({
				id: "SIGN_IN_WRONG_AUTH_TOKEN",
				message: "Wrong auth token",
				type: HttpError.types.UNAUTHORIZED,
			});
		}

		const token = await signAuthToken(authToken);
		const response = NextResponse.json({ signedIn: true, date: new Date() });
		setAuthCookie(response, token);

		return response;
	} catch (error) {
		return sendServerError(error);
	}
}
