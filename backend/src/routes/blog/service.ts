import DataManager from "~/modules/data-manager";

class BlogService {
	async get() {
		const posts = await DataManager.query({ model: "blog" });

		return posts;
	}
}

export default new BlogService();
