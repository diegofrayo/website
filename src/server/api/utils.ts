import type { NextApiResponse } from "next";

export function sendServerError(res: NextApiResponse, error: unknown) {
	res.status(getStatusCode(error)).json(createServerErrorMessage(error));
}

function getStatusCode(error: unknown) {
	console.log(error);
	return 500;
}

function createServerErrorMessage(error: unknown) {
	console.log(error);
	return { message: "Error from our API" };
}
