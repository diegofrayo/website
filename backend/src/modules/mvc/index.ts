import type { T_NextFunction, T_Request, T_Response } from "~/types";

export abstract class Controller {
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

export type T_Controller = new () => Controller;

type T_Config = Record<
	string,
	{
		method: "get" | "post" | "put" | "patch" | "delete";
		handler: (req: T_Request, res: T_Response, next: T_NextFunction) => void;
	}
>;
