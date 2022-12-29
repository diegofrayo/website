import { GetStaticPaths } from "next";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

import BlogPostPage from "~/features/pages/blog/[slug]";
import BlogService, { T_BlogPost } from "~/features/pages/blog/service";
import { getPageContentStaticProps, T_Locale } from "~/features/i18n";
import { getMDXScope } from "~/features/mdx";
import { ROUTES } from "~/features/routing";
import dataLoader from "~/server";
import { replaceAll } from "~/utils/strings";
import { isUndefined } from "~/utils/validations";

export default BlogPostPage;

// --- Next.js functions ---

type T_StaticPath = { slug: string };

export const getStaticPaths: GetStaticPaths<T_StaticPath> = async function getStaticPaths() {
	return {
		paths: (await BlogService.fetchPosts())
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
	callback: async ({ params, locale }) => {
		const post = await BlogService.fetchPost({ slug: params.slug, locale });

		if (isUndefined(post)) {
			return {
				notFound: true,
			};
		}

		const file = (await dataLoader({
			path: `/pages/blog/[slug]/${locale}/${replaceAll(post.createdAt, "/", "-")}-${post.slug}.mdx`,
		})) as string;
		const postMDXContent = await serialize(file, {
			mdxOptions: { development: false },
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
