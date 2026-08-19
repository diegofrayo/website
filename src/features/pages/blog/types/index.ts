import type UtilsTypes from "@diegofrayo-pkg/types";

export type BlogPost = {
	slug: string;
	title: string;
	description: string;
	categories: string[];
	locales: ("es" | "en")[];
	created_at: string;
	published_at: string;
	updated_at: string;
	is_published: boolean;
	sources: { title: string; url: string }[];
	assets: UtilsTypes.GenericObject<string>;
};

export type BlogPosts = Array<Omit<BlogPost, "sources" | "assets">>;

export type BlogPostWithContent = {
	details: BlogPost;
	content: string;
};
