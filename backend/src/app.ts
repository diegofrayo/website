import express from "express";

import { getEntries } from "~/utils/objects-and-arrays";
import envVars from "~/utils/env";
import type { T_Controller } from "~/types";

class App {
	private app: express.Application;

	constructor(controllers: T_Controller[]) {
		this.app = express();
		this.initControllers(controllers);
	}

	start(): void {
		const PORT = 3000;

		this.app.listen(envVars.PORT, () => {
			console.log(`The application is running on port ${PORT}`);
		});
	}

	initControllers(controllers: T_Controller[]): void {
		controllers.forEach((Controller) => {
			const controller = new Controller();

			getEntries(controller.getConfig()).forEach(([path, pathConfig]) => {
				this.app[pathConfig.method](`/${controller.name}${path}`, pathConfig.handler);
			});
		});
	}
}

export default App;
