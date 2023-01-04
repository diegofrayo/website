import v from "~/lib/validator";
import type { T_NextFunction, T_Request, T_Response } from "~/types";

// --- Utils ---

export function getUserSession(req: T_Request): T_UserSession {
	const DEFAULT_VALUES = {
		isUserLoggedIn: false,
	};
	const userSession = {
		isUserLoggedIn: v.isUndefined(req.session.isUserLoggedIn)
			? DEFAULT_VALUES.isUserLoggedIn
			: req.session.isUserLoggedIn,
	};

	return userSession;
}

// --- Middleware ---

/*
// TODO: Enable this someday

// import session from "express-session";
// import memorystore from "memorystore";

const MemoryStore = memorystore(session);

export const sessionMiddleware = [
	session({
		cookie: {
			maxAge: 86_400_000, // The cookie that stores the session id will expire in 24hrs
			httpOnly: true, // The cookie only can be readed by the server, but no by the client
			secure: envVars.isProduction,
		},
		store: new MemoryStore({
			checkPeriod: 86_400_000, // It prunes expired entries every 24h
		}),
		secret: envVars.SESSIONS_TOKEN,
		resave: false,
		saveUninitialized: false,
	}),
];
*/

export const sessionMiddleware = [
	(_: T_Request, __: T_Response, next: T_NextFunction): void => {
		next();
	},
];

// --- Types ---

/*
// TODO: Enable this someday
declare module "express-session" {
	// NOTE: This "disable" statement is ok, because these types statement is like a little hack
	// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-empty-interface
	interface SessionData extends I_UserSession {}
}
*/

declare module "express-serve-static-core" {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface Request {
		session: T_UserSession;
	}
}

export type T_UserSession = {
	isUserLoggedIn: boolean;
};
