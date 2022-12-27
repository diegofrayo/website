import App from "~/app";
import * as middlewares from "~/middlewares";
import BlogController from "~/routes/blog";
import DataController, { dataControllerMiddleware } from "~/routes/data";
import MusicController from "~/routes/music";
import ReadingsController from "~/routes/readings";

new App({
	controllers: [BlogController, MusicController, ReadingsController, DataController],
	middlewares: [...Object.values(middlewares), dataControllerMiddleware],
}).start();
