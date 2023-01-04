import App from "~/app";
import {
	basicResourcesProtectionMiddleware,
	cookieParserMiddleware,
	requestsBodyParserMiddleware,
	staticFilesMiddleware,
} from "~/middlewares";
import { errorHandlerMiddleware } from "~/modules/errors-handling";
import { authMiddleware } from "~/modules/auth";
import BlogController from "~/routes/blog";
import DataRouter from "~/routes/data";
import MusicController from "~/routes/music";
import ReadingsController from "~/routes/readings";
import TestsController from "~/routes/tests";

new App({
	routers: [DataRouter],
	controllers: [BlogController, MusicController, ReadingsController, TestsController],
	middlewares: {
		beforeControllers: [
			staticFilesMiddleware,
			requestsBodyParserMiddleware,
			cookieParserMiddleware,
			basicResourcesProtectionMiddleware,
			authMiddleware,
		],
		afterControllers: [errorHandlerMiddleware],
	},
}).start();
