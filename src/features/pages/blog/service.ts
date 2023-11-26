import { I18nService, T_Locale } from "~/features/i18n";
import v from "~/lib/v";
import {
	sortBy,
	transformObjectKeysFromSnakeCaseToLowerCamelCase,
} from "~/utils/objects-and-arrays";
import type { T_Object } from "~/types";

class BlogServiceClass {
	fetchPosts = async (data: {
		posts: T_BlogPostFetchDTO[];
		categories: T_BlogPostCategory[];
	}): Promise<T_BlogPost[]> => {
		const { posts, categories } = data;

		const result = Object.values(posts)
			.map((blogPost) => BlogPostVO(blogPost, categories))
			.sort(sortBy("-publishedAt"));

		return result;
	};

	fetchPost = async (
		data: {
			posts: T_BlogPostFetchDTO[];
			categories: T_BlogPostCategory[];
		},
		criteria: {
			slug: T_BlogPost["slug"];
		},
	): Promise<T_BlogPost | undefined> => {
		const posts = await this.fetchPosts(data);
		const post = posts.find((item) => item.slug === criteria.slug);

		return post;
	};
}

const BlogService = new BlogServiceClass();

export default BlogService;

// --- Value objects ---

function BlogPostVO(
	blogPostData: T_BlogPostFetchDTO,
	categories: T_BlogPostCategory[],
	locale?: T_Locale,
): T_BlogPost {
	let blogPost = transformObjectKeysFromSnakeCaseToLowerCamelCase<T_BlogPost>(blogPostData);

	blogPost = {
		...blogPost,
		...transformObjectKeysFromSnakeCaseToLowerCamelCase(blogPostData.config),
		...transformObjectKeysFromSnakeCaseToLowerCamelCase(
			blogPostData[
				I18nService.getContentLocale({
					locales: blogPostData.config.locales,
					currentLocale: locale || I18nService.getCurrentLocale(),
					defaultLocale: blogPostData.config.locales[0],
				})
			],
		),
	};

	blogPost.categories = blogPostData.config.categories
		.map((category): T_BlogPostCategory | undefined => {
			return categories.find((item) => item.id === category);
		})
		.filter((category): category is T_BlogPostCategory => {
			return v.exists(category);
		})
		.sort(sortBy("value"));

	blogPost.assets = {
		...blogPost.assets,
		sourceCodeSnippets: blogPost.assets?.sourceCodeSnippets || {},
	};
	blogPost.sources ??= [];

	return blogPost;
}

// --- TYPES ---

export type T_BlogPost = {
	title: string;
	description: string;
	slug: string;
	categories: T_BlogPostCategory[];
	locales: T_Locale[];
	thumbnail: string;
	createdAt: string;
	publishedAt: string;
	updatedAt: string;
	isPublished: boolean;
	hasToBePreRendered: boolean;
	sources: { title: string; url: string }[];
	assets: T_Object & {
		sourceCodeSnippets: T_Object<string>;
	};
};

type T_BlogPostCategory = { id: string; value: string; color: string };

type T_BlogPostFetchDTO = {
	config: {
		slug: string;
		categories: Array<T_BlogPostCategory["id"]>;
		locales: T_Locale[];
		created_at: string;
		published_at: string;
		updated_at: string;
		is_published: boolean;
	};
	en: {
		title: string;
		description: string;
	};
	assets: T_Object<string>;
};
