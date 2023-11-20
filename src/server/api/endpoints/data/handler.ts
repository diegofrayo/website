import type { NextApiRequest, NextApiResponse } from "next";

import { loadData } from "~/server/data-loader";
import { sendServerError } from "../../utils";
import { parseRequestBody } from "./schemas";

export default async function dataHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { model } = parseRequestBody(req.body);
		const data = await loadData({ page: model, remote: true });

		res.json(data);
	} catch (error) {
		sendServerError(res, error);
	}
}
