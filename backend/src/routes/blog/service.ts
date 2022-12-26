import DataManager from "~/modules/data-manager";

import { T_RawBlogResponse } from "./model";

class BlogService {
	async get(): Promise<T_RawBlogResponse> {
		const posts = await DataManager.query<T_RawBlogResponse>({ model: "blog" });

		return posts;
	}
}

export default new BlogService();
