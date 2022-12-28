import App from "~/app";
import {
	requestsBodyParserMiddleware,
	basicProtectionForAllRoutesMiddleware,
	authMiddleware,
	errorHandlerMiddleware,
} from "~/middlewares";
import { sessionMiddleware } from "~/modules/session";
import BlogController from "~/routes/blog";
import DataController, { dataControllerMiddleware } from "~/routes/data";
import MusicController from "~/routes/music";
import ReadingsController from "~/routes/readings";
import TestsController from "~/routes/tests";

new App({
	controllers: [
		BlogController,
		DataController,
		MusicController,
		ReadingsController,
		TestsController,
	],
	middlewares: {
		beforeControllers: [
			requestsBodyParserMiddleware,
			sessionMiddleware,
			authMiddleware,
			basicProtectionForAllRoutesMiddleware,
			dataControllerMiddleware,
		],
		afterControllers: [errorHandlerMiddleware],
	},
}).start();
