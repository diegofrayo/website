import v from "~/lib/validator";
import envVars from "~/modules/env";
import type { T_NextFunction, T_Request, T_Response } from "~/types";

function auth(req: T_Request, _: T_Response, next: T_NextFunction): void {
	if (readAuthToken(req.headers.authorization) === envVars.AUTH_TOKEN) {
		req.session.isUserLoggedIn = true;
	}

	next();
}

export const authMiddleware = [auth];

// --- Utils ---

function readAuthToken(authorization: unknown): string {
	if (v.isString(authorization)) {
		return authorization.replace("Bearer ", "");
	}

	return "";
}

// --- Types ---

declare module "express-serve-static-core" {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface Request {
		session: T_UserSession;
	}
}

export type T_UserSession = {
	isUserLoggedIn: boolean;
};

/*
import jwt from "jsonwebtoken";

import envVars from "~/modules/env";
import { relativeToMiliseconds } from "~/utils/dates-and-time";
import type { T_NextFunction, T_Request, T_Response } from "~/types";

// --- Middleware ---

function auth(req: T_Request, res: T_Response, next: T_NextFunction): void {
	if (req.cookies.dfr_auth) {
		try {
			const userSessionData = AuthService.readJWT(req);
			req.session.user = userSessionData;
		} catch (error) {
			AuthService.removeAuthCookie(res);
		}
	}

	next();
}

export const authMiddleware = [auth];

// --- Service ---

class AuthServiceClass {
	AUTH_COOKIE_NAME = "dfr_auth";

	getUserSession(req: T_Request): T_UserSession["user"] {
		const DEFAULT_VALUES = {
			role: "guest",
		};
		const userSession = {
			isUserLoggedIn: v.isUndefined(req.session.isUserLoggedIn)
				? DEFAULT_VALUES.isUserLoggedIn
				: req.session.isUserLoggedIn,
		};

		return userSession;
	}

	getAuthCookie(req: T_Request): string {
		return req.cookies[this.AUTH_COOKIE_NAME];
	}

	saveAuthCookie(res: T_Response, token: string): void {
		res.cookie(this.AUTH_COOKIE_NAME, token, {
			maxAge: relativeToMiliseconds(1, "month"),
			secure: envVars.isProduction,
			httpOnly: true,
		});
	}

	removeAuthCookie(res: T_Response): void {
		res.clearCookie(this.AUTH_COOKIE_NAME);
	}

	readJWT(req: T_Request): T_UserSession["user"] {
		return jwt.verify(this.getAuthCookie(req), envVars.JWT_SECRET) as T_UserSession["user"];
	}

	writeJWT(userSession: T_UserSession["user"]): string {
		return jwt.sign(userSession, envVars.JWT_SECRET, { expiresIn: "1m" });
	}
}

export const AuthService = new AuthServiceClass();

// --- Types ---

declare module "express-serve-static-core" {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface Request {
		session: T_UserSession;
	}
}

export type T_UserSession = {
	user: {
		id: string;
		role: "ADMIN" | "GUEST";
	};
};
*/
