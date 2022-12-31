import { Controller } from "~/modules/mvc";
import type { T_Request, T_Response } from "~/types";

import { findDataReqBodySchema } from "./models";
import DataService from "./service";

class DataController extends Controller {
	constructor() {
		super("data");
		this.config = {
			"/": {
				method: "post",
				handler: this.findData,
			},
		};
	}

	private async findData(req: T_Request, res: T_Response): Promise<void> {
		// TODO: Custom error
		const { model } = findDataReqBodySchema.parse(req.body);
		const response = await DataService.findData(model);

		res.json(response);
	}
}

export default DataController;
