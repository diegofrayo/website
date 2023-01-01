import session from "express-session";
import memorystore from "memorystore";

import envVars from "~/modules/env";
import type { T_Request } from "~/types";

// --- Utils ---

export function getUserSession(req: T_Request): I_UserSession {
	if (!req.session) {
		return {
			isUserLoggedIn: false,
		};
	}

	return req.session as I_UserSession;
}

// --- Middleware ---

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

// --- Types ---

declare module "express-session" {
	// NOTE: This "disable" statement is ok, because these types statement is like a little hack
	// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-empty-interface
	interface SessionData extends I_UserSession {}
}

export interface I_UserSession {
	isUserLoggedIn: boolean;
}
