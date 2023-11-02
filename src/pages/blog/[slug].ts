import type { GetStaticProps, GetStaticPaths } from "next";

import { loadData } from "~/server/data-loader";
import { compile } from "~/modules/mdx/server";
import type { T_RawBlogPostResponse, T_RawBlogPostsResponse } from "~/modules/pages/blog/types";
import type { T_BlogPostPageProps } from "~/modules/pages/blog/pages/BlogPostPage";

export { default } from "~/modules/pages/blog/pages/BlogPostPage";

// --- NEXT.JS FUNCTIONS ---

export const getStaticPaths: GetStaticPaths = async function getStaticPaths() {
	const data = await loadData<T_RawBlogPostsResponse>({ localPath: `./src/data/blog/data.json` });

	return {
		paths: Object.values(data).map((post) => {
			return { params: { slug: post.slug } };
		}),
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps<T_BlogPostPageProps, { slug: string }> = async ({
	params,
}) => {
	const DEFAULT_LANG = "en";
	const slug = params?.slug || "";
	if (!slug) throw new Error(`Invalid slug: "${slug}"`);

	const post = await loadData<T_RawBlogPostResponse>({
		localPath: `./src/data/blog/posts/${slug}.json`,
	});
	const mdxCompiled = await compile({ content: post.content });

	return {
		props: {
			postDetails: {
				...post.details,
				content: post.details.content[DEFAULT_LANG],
			},
			postContent: mdxCompiled.code,
		},
	};
};
