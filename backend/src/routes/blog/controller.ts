import { I_Controller, T_Request, T_Response } from "~/types";

import BlogService from "./service";

class BlogController extends I_Controller {
	constructor() {
		super("blog");
		this.config = {
			"/": {
				method: "get",
				handler: this.get,
			},
		};
	}

	private async get(_: T_Request, res: T_Response): Promise<void> {
		const posts = await BlogService.get();

		res.json(posts);
	}
}

export default BlogController;
