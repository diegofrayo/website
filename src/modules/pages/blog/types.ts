import type DR from "@diegofrayo/types";

export type T_RawBlogPostsResponse = DR.Object<T_RawBlogPostResponse["details"]>;

export type T_RawBlogPostResponse = {
	details: {
		slug: string;
		content: {
			en: {
				title: string;
				description: string;
			};
		};
		categories: string[];
		locales: string[];
		created_at: string;
		published_at: string;
		updated_at: string;
		is_published: boolean;
		sources: { title: string; url: string }[];
		assets: DR.Object;
	};
	content: string;
};

export type T_BlogPost = Omit<T_RawBlogPostResponse["details"], "content"> & {
	content: T_RawBlogPostResponse["details"]["content"]["en"];
};
