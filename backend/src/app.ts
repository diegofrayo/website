import express from "express";

import { getEntries } from "~/utils";
import envVars from "~/utils/env";
import type { Controller } from "~/types";

class App {
	private app: express.Application;

	constructor(controllers: Controller[]) {
		this.app = express();
		this.initControllers(controllers);
	}

	start() {
		const PORT = 3000;

		this.app.listen(envVars.PORT, () => {
			console.log(`The application is running on port ${PORT}`);
		});
	}

	initControllers(controllers: Controller[]) {
		controllers.map((Controller) => {
			const controller = new Controller();

			getEntries(controller.getConfig()).forEach(([path, pathConfig]) => {
				this.app[pathConfig.method](`/${controller.name}${path}`, pathConfig.handler);
			});
		});
	}
}

export default App;
