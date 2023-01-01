import express from "express";

import AppError from "~/exceptions/AppError";

// --- Express ---

export type T_Middleware =
	| ((req: T_Request, res: T_Response, next: T_NextFunction) => void | Promise<void>)
	| T_ErrorMiddleware;

export type T_ErrorMiddleware = (
	error: Error,
	req: T_Request,
	res: T_Response,
	next: T_NextFunction,
) => void | Promise<void>;

export type T_Request = express.Request;

export type T_Response = express.Response;

export type T_NextFunction = express.NextFunction;

export type T_ExpressRouter = express.Router;

export type T_ExpressApplication = express.Application;

declare module "express-serve-static-core" {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface Response {
		sendError: (error: AppError) => unknown;
	}
}

// --- Data ---

export type T_Primitive = string | number | boolean | null;

// --- Objects ---

export type T_Object<G_Type = unknown> = T_GenericObject<G_Type>;

export type T_JSON = T_GenericObject<
	string | number | boolean | null | T_JSON[] | { [key: string]: T_JSON }
>;

type T_GenericObject<G_Type = unknown> = Record<string | number | symbol, G_Type>;
