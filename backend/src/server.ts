import App from "~/app";
import {
	basicResourcesProtectionMiddleware,
	cookieParserMiddleware,
	corsMiddleware,
	requestsBodyParserMiddleware,
	staticFilesMiddleware,
} from "~/middlewares";
import { errorHandlerMiddleware } from "~/modules/errors-handling";
import { authMiddleware } from "~/modules/auth";
import BlogController from "~/routes/blog";
import DataRouter from "~/routes/data";
import MusicController from "~/routes/music";
import ReadingsController from "~/routes/readings";
import TestsRouter from "~/routes/tests";

new App({
	routers: [DataRouter, TestsRouter],
	controllers: [BlogController, MusicController, ReadingsController],
	middlewares: {
		beforeControllers: [
			corsMiddleware,
			staticFilesMiddleware,
			requestsBodyParserMiddleware,
			cookieParserMiddleware,
			basicResourcesProtectionMiddleware,
			authMiddleware,
		],
		afterControllers: [errorHandlerMiddleware],
	},
}).start();