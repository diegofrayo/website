import { Controller } from "~/modules/mvc";
import { parseSchema } from "~/modules/schemas";
import type { T_Request, T_Response } from "~/types";

import { findDataReqBodySchema, T_FindDataReqBody } from "./models";
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
		const { model } = parseSchema<T_FindDataReqBody>(findDataReqBodySchema, req.body, {
			httpError: true,
		});
		const response = await DataService.findData(model);

		res.json(response);
	}
}

export default DataController;
