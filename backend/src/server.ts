import App from "~/app";
import {
	requestsBodyParserMiddleware,
	basicResourcesProtectionMiddleware,
	authMiddleware,
} from "~/middlewares";
import { errorHandlerMiddleware } from "~/modules/errors-handling";
import { sessionMiddleware } from "~/modules/session";
import AuthController from "~/routes/auth";
import BlogController from "~/routes/blog";
import DataRouter from "~/routes/data";
import MusicController from "~/routes/music";
import ReadingsController from "~/routes/readings";
import TestsController from "~/routes/tests";

new App({
	routers: [DataRouter],
	controllers: [
		BlogController,
		MusicController,
		ReadingsController,
		TestsController,
		AuthController,
	],
	middlewares: {
		beforeControllers: [
			requestsBodyParserMiddleware,
			sessionMiddleware,
			basicResourcesProtectionMiddleware,
			authMiddleware,
		],
		afterControllers: [errorHandlerMiddleware],
	},
}).start();
