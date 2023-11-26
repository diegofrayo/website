import { GetStaticPaths } from "next";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

import BlogPostPage from "~/features/pages/blog/[slug]";
import BlogService, { T_BlogPost } from "~/features/pages/blog/service";
import { T_Locale } from "~/features/i18n";
import getPageContentStaticProps from "~/features/i18n/server";
import { getMDXScope } from "~/features/mdx";
import { ROUTES } from "~/features/routing";
import v from "~/lib/v";
import { dataFileLoader } from "~/server";
import { replaceAll } from "~/utils/strings";

export default BlogPostPage;

// --- NEXT.JS FUNCTIONS ---

type T_StaticPath = { slug: string };

export const getStaticPaths: GetStaticPaths<T_StaticPath> = async function getStaticPaths() {
	return {
		paths: (await BlogService.fetchPosts(await dataFileLoader("blog/data.json")))
			.filter((post) => post.hasToBePreRendered)
			.reduce((result: { params: T_StaticPath; locale: T_Locale }[], post: T_BlogPost) => {
				return result.concat(
					post.locales.map((locale: T_Locale) => {
						return { params: { slug: post.slug }, locale };
					}),
				);
			}, []),
		fallback: "blocking",
	};
};

export const getStaticProps = getPageContentStaticProps<
	{ post: T_BlogPost; postMDXContent: MDXRemoteSerializeResult },
	T_StaticPath
>({
	page: [ROUTES.BLOG, ROUTES.BLOG_DETAILS],
	localesExtractor: (data) => data.post.locales,
	callback: async ({ params }) => {
		const post = await BlogService.fetchPost(await dataFileLoader("blog/data.json"), {
			slug: params.slug,
		});

		if (v.isUndefined(post)) {
			return {
				notFound: true,
			};
		}

		const file = (await dataFileLoader(
			`blog/[slug]/posts/en/${replaceAll(post.createdAt, "/", "-")}-${post.slug}.mdx`,
		)) as string;
		const postMDXContent = await serialize(file, {
			scope: {
				DATA: {
					...getMDXScope().DATA,
					post,
				},
			},
		});

		return {
			props: {
				post,
				postMDXContent,
			},
		};
	},
});
