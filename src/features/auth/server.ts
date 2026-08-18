import { jwtVerify, SignJWT } from "jose";
import type { NextApiRequest, NextApiResponse } from "next";

import { EnvVars } from "~/constants";

export const AUTH_COOKIE_NAME = "auth_token";

type AuthTokenPayload = {
	authToken: string;
};

export async function signAuthToken(authToken: string): Promise<string> {
	return new SignJWT({ authToken })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.sign(getJWTSecret());
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload> {
	const { payload } = await jwtVerify<AuthTokenPayload>(token, getJWTSecret());

	return { authToken: payload.authToken };
}

export function setAuthCookie(res: NextApiResponse, token: string): void {
	const cookieAttributes = [
		`${AUTH_COOKIE_NAME}=${token}`,
		"Path=/",
		"HttpOnly",
		"SameSite=Lax",
		...(EnvVars.NODE_ENV === "production" ? ["Secure"] : []),
	];

	res.setHeader("Set-Cookie", cookieAttributes.join("; "));
}

export function getAuthCookie(req: NextApiRequest): string | undefined {
	return req.cookies[AUTH_COOKIE_NAME];
}

export function clearAuthCookie(res: NextApiResponse): void {
	const cookieAttributes = [
		`${AUTH_COOKIE_NAME}=`,
		"Path=/",
		"HttpOnly",
		"SameSite=Lax",
		"Max-Age=0",
		...(EnvVars.NODE_ENV === "production" ? ["Secure"] : []),
	];

	res.setHeader("Set-Cookie", cookieAttributes.join("; "));
}

function getJWTSecret(): Uint8Array {
	return new TextEncoder().encode(EnvVars.JWT_SECRET);
}
