import express from "express";

import envVars from "~/utils/env";
import { getEntries } from "~/utils/objects-and-arrays";
import type { T_Controller } from "~/modules/mvc";
import type { T_Middleware } from "~/types";

class App {
	private app: express.Application;

	constructor(config: { controllers: T_Controller[]; middlewares: T_Middleware[][] }) {
		this.app = express();
		this.initControllers(config.controllers);
		this.initMiddlewares(config.middlewares);

		// this.app.get("/error", (req: T_Request, res: T_Response, next: T_NextFunction) => {
		// 	throw new Error("My error");
		// 	console.log(req, res, next);
		// 	// setTimeout(() => {
		// 	// 	try {
		// 	// 		throw new Error("My error");
		// 	// 	} catch (error) {
		// 	// 		next(error);
		// 	// 	}
		// 	// }, 1000);
		// });
	}

	start(): void {
		this.app.listen(envVars.PORT, () => {
			console.log(`The application is running on port ${envVars.PORT}`);
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
