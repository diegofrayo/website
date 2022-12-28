import express from "express";

import envVars from "~/modules/env";
import { logger } from "~/modules/logger";
import { getEntries } from "~/utils/objects-and-arrays";
import type { T_Controller } from "~/modules/mvc";
import type { T_Middleware } from "~/types";

class App {
	private app: express.Application;

	constructor(config: {
		controllers: T_Controller[];
		middlewares: { beforeControllers: T_Middleware[][]; afterControllers: T_Middleware[][] };
	}) {
		this.app = express();
		this.initMiddlewares(config.middlewares.beforeControllers);
		this.initControllers(config.controllers);
		this.initMiddlewares(config.middlewares.afterControllers);
	}

	start(): void {
		this.app.listen(envVars.PORT, () => {
			logger("log", `The application is running on port ${envVars.PORT}`);
		});
	}

	initControllers(controllers: T_Controller[]): void {
		controllers.forEach((Controller) => {
			const controller = new Controller();

			getEntries(controller.getConfig()).forEach(([path, pathConfig]) => {
				this.app[pathConfig.method](`/${controller.name}${path}`, async (req, res, next) => {
					try {
						await pathConfig.handler(req, res, next);
					} catch (error) {
						next(error);
					}
				});
			});
		});
	}

	initMiddlewares(middlewares: T_Middleware[][]): void {
		middlewares.forEach((item) => {
			item.forEach((middleware) => {
				this.app.use(middleware);
			});
		});
	}
}

export default App;
