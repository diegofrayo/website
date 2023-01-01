import express from "express";

import AppError from "~/exceptions/AppError";
import envVars from "~/modules/env";
import { getError } from "~/modules/errors-handling";
import { logger } from "~/modules/logger";
import { injectControllers, T_Controller } from "~/modules/mvc";
import type { T_ExpressApplication, T_ExpressRouter, T_Middleware } from "~/types";

class App {
	private app: T_ExpressApplication;

	constructor(config: {
		controllers: T_Controller[];
		routers: T_ExpressRouter[];
		middlewares: { beforeControllers: T_Middleware[][]; afterControllers: T_Middleware[][] };
	}) {
		this.app = express();

		this.extendResponseObject();
		this.initMiddlewares(config.middlewares.beforeControllers);
		this.initControllers(config.controllers, this.app);
		this.initRouters(config.routers);
		this.initMiddlewares(config.middlewares.afterControllers);
	}

	start(): void {
		this.app.listen(envVars.PORT, () => {
			logger("log", `The application is running on port ${envVars.PORT}`);
		});
	}

	initControllers(controllers: T_Controller[], app: T_ExpressApplication): void {
		injectControllers(controllers, app);
	}

	initRouters(routers: T_ExpressRouter[]): void {
		routers.forEach((router) => {
			this.app.use("/", router);
		});
	}

	initMiddlewares(middlewares: T_Middleware[][]): void {
		middlewares.forEach((item) => {
			item.forEach((middleware) => {
				this.app.use(middleware);
			});
		});
	}

	extendResponseObject(): void {
		// NOTE: I don't know how to solve this type error, I didn't find docs
		// or examples about it
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this.app.response.sendError = function sendError(error: AppError): unknown {
			return this.status(error.statusCode).send(getError(error, this).body);
		};
	}
}

export default App;
