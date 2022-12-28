import DataManager from "~/modules/data-manager";

import { T_RawBlogResponse } from "./models";

class BlogService {
	async get(): Promise<T_RawBlogResponse> {
		const posts = await DataManager.query<T_RawBlogResponse>({ model: "blog" });

		return posts;
	}

	filterResults(rawMusicResponse: T_RawBlogResponse, isUserLoggedIn: boolean): T_RawBlogResponse {
		if (isUserLoggedIn) {
			return rawMusicResponse;
		}

		return {
			...rawMusicResponse,
			posts: Object.values(rawMusicResponse.posts).reduce((result, blogPost) => {
				if (blogPost.config.is_published) {
					return {
						...result,
						[blogPost.config.slug]: blogPost,
					};
				}

				return result;
			}, {}),
		};
	}
}

export default new BlogService();
