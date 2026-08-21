import { NextResponse } from "next/server";

import { clearAuthCookie } from "~/features/auth/auth.server";

import { sendServerError } from "../../utils";

export default async function signOutHandler() {
	try {
		const response = NextResponse.json({ signedOut: true });
		clearAuthCookie(response);

		return response;
	} catch (error) {
		return sendServerError(error);
	}
}
