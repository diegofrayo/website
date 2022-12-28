import App from "~/app";
import {
	requestsBodyParserMiddleware,
	protectAllResourcesMiddleware,
	authMiddleware,
	errorHandlerMiddleware,
} from "~/middlewares";
import { sessionMiddleware } from "~/modules/session";
import BlogController from "~/routes/blog";
import DataController, { dataControllerMiddleware } from "~/routes/data";
import MusicController from "~/routes/music";
import ReadingsController from "~/routes/readings";

new App({
	controllers: [BlogController, MusicController, ReadingsController, DataController],
	middlewares: [
		requestsBodyParserMiddleware,
		sessionMiddleware,
		authMiddleware,
		protectAllResourcesMiddleware,
		dataControllerMiddleware,
		errorHandlerMiddleware,
	],
}).start();
