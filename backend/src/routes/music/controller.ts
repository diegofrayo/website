import { IController } from "~/types";

import MusicService from "./service";

class MusicController extends IController {
	constructor() {
		super();
		this.name = "music";
		this.config = {
			"/": {
				method: "get",
				handler: this.get,
			},
		};
	}

	private async get(_, res) {
		const response = await MusicService.get();

		res.json(response);
	}
}

export default MusicController;
