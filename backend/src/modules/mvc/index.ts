import AppError from "~/exceptions/AppError";
import ServerError from "~/exceptions/ServerError";
import { getEntries } from "~/utils/objects-and-arrays";
import type {
	T_ExpressApplication,
	T_NextFunction,
	T_Request,
	T_Response,
	T_ExpressRouter,
} from "~/types";

// --- Controllers ---

export abstract class Controller {
	protected config: T_Config | undefined;
	public readonly name: string;

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

export function injectControllers(
	controllers: T_Controller[],
	app: T_ExpressRouter | T_ExpressApplication,
): void {
	controllers.forEach((ControllerClass) => {
		const controller = new ControllerClass();

		getEntries(controller.getConfig()).forEach(([path, pathConfig]) => {
			// NOTE: I don't know why I had to use this "as", I got a weird typescript error, but I think this assertion is safe
			(app as T_ExpressApplication)[pathConfig.method](
				`/${controller.name}${path}`,
				async (req, res, next) => {
					try {
						await pathConfig.handler(req, res, next);
					} catch (error) {
						if (error instanceof AppError) {
							next(error);
						} else {
							next(
								new ServerError({
									id: "controller_error",
									description: "an uncaught error has been thrown from a controller",
									cause: error,
								}),
							);
						}
					}
				},
			);
		});
	});
}

// --- Types ---

export type T_Controller = new () => Controller;

type T_Config = Record<
	string,
	{
		method: "get" | "post" | "put" | "patch" | "delete";
		handler: (req: T_Request, res: T_Response, next: T_NextFunction) => void;
	}
>;
