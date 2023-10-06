import type DR from "@diegofrayo/types";

export type T_RawBlogPostsResponse = DR.Object<T_RawBlogPost>;

export type T_BlogPost = Pick<T_RawBlogPost, "config" | "assets"> & {
	content: T_RawBlogPost["content"]["en"];
};

type T_RawBlogPost = {
	config: {
		slug: string;
		categories: Array<string>;
		locales: Array<string>;
		created_at: string;
		published_at: string;
		updated_at: string;
		is_published: boolean;
		sources: Array<{ title: string; url: string }>;
	};
	content: {
		en: {
			title: string;
			description: string;
		};
	};
	assets: DR.Object;
};
