import { Controller } from "~/modules/mvc";
import type { T_Request, T_Response } from "~/types";

import ReadingsService from "./service";

class ReadingsController extends Controller {
	constructor() {
		super("readings");
		this.config = {
			"/": {
				method: "get",
				handler: this.get,
			},
		};
	}

	private async get(_: T_Request, res: T_Response): Promise<void> {
		const response = await ReadingsService.get();

		res.json(response);
	}
}

export default ReadingsController;
