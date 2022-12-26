import { IController } from "~/types";

import BlogService from "./service";

class BlogController extends IController {
	constructor() {
		super();
		this.name = "blog";
		this.config = {
			"/": {
				method: "get",
				handler: this.get,
			},
		};
	}

	private async get(_, res) {
		const posts = await BlogService.get();

		res.json(posts);
	}
}

export default BlogController;
