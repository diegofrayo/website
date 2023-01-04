import { Controller } from "~/modules/mvc";
import type { T_Request, T_Response } from "~/types";

import MusicService from "./service";

class MusicController extends Controller {
	constructor() {
		super("music");
		this.config = {
			"/": {
				method: "get",
				handler: this.get,
			},
			"/:songId": {
				method: "get",
				handler: this.findSong,
			},
		};
	}

	private async get(req: T_Request, res: T_Response): Promise<void> {
		const response = await MusicService.get();

		res.json(MusicService.filterResults(response, req.session.isUserLoggedIn));
	}

	private async findSong(req: T_Request, res: T_Response): Promise<void> {
		const response = await MusicService.findOne(req.params["songId"]);

		res.json(response);
	}
}

export default MusicController;
