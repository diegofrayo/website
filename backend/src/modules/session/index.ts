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
		cookie: { maxAge: 86400000 },
		store: new MemoryStore({
			checkPeriod: 86400000, // prune expired entries every 24h
		}),
		resave: false,
		secret: envVars.SESSION_TOKEN,
	}),
];

// --- Types ---

export interface I_UserSession {
	isUserLoggedIn: boolean;
}

declare module "express-session" {
	// NOTE: This "disable" statement is ok, because these types statement is like a little hack
	// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-empty-interface
	interface SessionData extends I_UserSession {}
}
