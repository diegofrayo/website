import AppError from "~/exceptions/AppError";
import ServerError from "~/exceptions/ServerError";
import v from "~/lib/validator";
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
	appParam: T_ExpressRouter | T_ExpressApplication,
): void {
	// NOTE: I don't know why I had to use this "as", I got a weird typescript error, but I think this assertion is safe
	const app = appParam as T_ExpressApplication;

	controllers.forEach((ControllerClass) => {
		const controller = new ControllerClass();

		getEntries(controller.getConfig()).forEach(([path, pathConfig]) => {
			if (v.isArray<T_RequestHandler>(pathConfig.handler)) {
				const middlewares = pathConfig.handler.slice(0, pathConfig.handler.length - 1);
				const handler = pathConfig.handler[pathConfig.handler.length - 1];

				app[pathConfig.method](
					`/${controller.name}${path}`,
					...middlewares,
					async (req, res, next) => {
						try {
							await handler(req, res, next);
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
			} else {
				app[pathConfig.method](`/${controller.name}${path}`, async (req, res, next) => {
					try {
						// TODO: Remove this "as"
						await (pathConfig.handler as T_RequestHandler)(req, res, next);
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
				});
			}
		});
	});
}

// --- Types ---

export type T_Controller = new () => Controller;

type T_Config = Record<
	string,
	{
		method: "get" | "post" | "put" | "patch" | "delete";
		handler: T_RequestHandler | T_RequestHandler[];
	}
>;

type T_RequestHandler = (req: T_Request, res: T_Response, next: T_NextFunction) => void;
