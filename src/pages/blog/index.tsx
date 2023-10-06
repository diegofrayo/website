import type { GetStaticProps } from "next";

import { loadData, loadPageContent } from "~/data/loader";
import type { T_BlogPageProps } from "~/features/pages/blog/BlogPage";
import type { T_RawBlogPostsResponse } from "~/features/pages/blog/types";

export { default } from "~/features/pages/blog/BlogPage";

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps: GetStaticProps<T_BlogPageProps> = async () => {
	const DEFAULT_LANG = "en";
	const content = await loadPageContent({ page: "blog" });
	const posts = await loadData<T_RawBlogPostsResponse>({ page: "blog" });

	return {
		props: {
			content,
			data: Object.values(posts)
				.filter((post) => post.config.is_published)
				.map((post) => {
					return {
						...post,
						content: post.content[DEFAULT_LANG],
					};
				}),
		},
	};
};
