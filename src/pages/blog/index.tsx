import type { GetStaticProps } from "next";

import { loadData, loadPageContent } from "~/server/data-loader";
import type { T_BlogPageProps } from "~/modules/pages/blog/BlogPage";
import type { T_RawBlogPostsResponse } from "~/modules/pages/blog/types";

export { default } from "~/modules/pages/blog/BlogPage";

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps: GetStaticProps<T_BlogPageProps> = async () => {
	const DEFAULT_LANG = "en";
	const content = await loadPageContent({ page: "blog" });
	const posts = await loadData<T_RawBlogPostsResponse>({ page: "blog" });

	return {
		props: {
			content,
			data: Object.values(posts).map((post) => {
				return {
					...post,
					content: post.content[DEFAULT_LANG],
				};
			}),
		},
	};
};
