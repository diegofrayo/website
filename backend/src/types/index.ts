import express from "express";

// --- Routing ---

export abstract class I_Controller {
	protected config: T_Config | undefined;
	public name: string;

	constructor(name: string) {
		this.name = name;
	}

	getConfig(): T_Config {
		if (!this.config) {
			throw new Error(`Controller "${this.name}" does not have a defined config`);
		}

		return this.config;
	}
}

export type T_Controller = new () => I_Controller;

export type T_Request = express.Request;

export type T_Response = express.Response;

type T_Config = Record<
	string,
	{
		method: "get" | "post" | "put" | "patch" | "delete";
		handler: (req: T_Request, res: T_Response) => void;
	}
>;

// --- Data ---

export type T_Primitive = string | number | boolean | null;

// --- Objects ---

type T_GenericObject<G_Type = unknown> = Record<string | number | symbol, G_Type>;

export type T_Object<G_Type = unknown> = T_GenericObject<G_Type>;

export type T_JSON = T_GenericObject<
	string | number | boolean | null | T_JSON[] | { [key: string]: T_JSON }
>;
