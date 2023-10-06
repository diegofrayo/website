import type { GetStaticProps, GetStaticPaths } from "next";

import { loadData } from "~/data/loader";
import { compile } from "~/modules/mdx/server";
import { replaceAll } from "@diegofrayo/utils/strings";
import type { T_RawBlogPostsResponse } from "~/modules/pages/blog/types";
import type { T_BlogPostPageProps } from "~/modules/pages/blog/BlogPostPage";

export { default } from "~/modules/pages/blog/BlogPostPage";

// --- NEXT.JS FUNCTIONS ---

export const getStaticPaths: GetStaticPaths = async function getStaticPaths() {
	const data = await loadData<T_RawBlogPostsResponse>({ page: "blog" });

	return {
		paths: Object.values(data)
			.filter((post) => post.config.is_published)
			.map((post) => {
				return { params: { slug: post.config.slug } };
			}),
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps<T_BlogPostPageProps, { slug: string }> = async ({
	params,
}) => {
	const DEFAULT_LANG = "en";
	const posts = await loadData<T_RawBlogPostsResponse>({ page: "blog" });
	const slug = params?.slug || "";
	const postDetails = { ...posts[slug] };

	if (!postDetails) throw new Error(`Invalid post slug: "${slug}"`);

	const mdxCompiled = await compile({
		source: `./src/data/generated/blog/posts/content/${replaceAll(
			postDetails.config.created_at,
			"/",
			"-",
		)}-${postDetails.config.slug}.mdx`,
	});

	return {
		props: {
			postDetails: {
				...postDetails,
				content: postDetails.content[DEFAULT_LANG],
			},
			postContent: mdxCompiled.code,
		},
	};
};
