import type { T_ErrorMiddleware } from "~/types";

const errorHandlerMiddleware: T_ErrorMiddleware = (err, _, res) => {
	console.log("errorHandler middleware");
	console.log(err);
	res.status(500).send("errorHandlerMiddleware");
};

export default [errorHandlerMiddleware];
