import { jwtVerify, SignJWT } from "jose";
import type { NextRequest, NextResponse } from "next/server";

import { EnvVars } from "~/constants";

const AUTH_COOKIE_NAME = "auth_token";
const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

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

export function setAuthCookie(res: NextResponse, token: string): void {
	res.cookies.set(AUTH_COOKIE_NAME, token, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
		secure: EnvVars.NODE_ENV === "production",
	});
}

export function getAuthCookie(req: NextRequest): string | undefined {
	return req.cookies.get(AUTH_COOKIE_NAME)?.value;
}

export function clearAuthCookie(res: NextResponse): void {
	res.cookies.delete(AUTH_COOKIE_NAME);
}

// --- UTILS ---

function getJWTSecret(): Uint8Array {
	return new TextEncoder().encode(EnvVars.JWT_SECRET);
}

// --- TYPES ---

type AuthTokenPayload = {
	authToken: string;
};
