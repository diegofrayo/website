import type { GetStaticProps } from "next";

import type { T_BlogPageProps } from "~/modules/pages/blog/BlogPage";
import type { T_RawBlogPostsResponse } from "~/modules/pages/blog/types";
import { loadData, loadPageContent } from "~/server/data-loader";

export { default } from "~/modules/pages/blog/BlogPage";

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps: GetStaticProps<T_BlogPageProps> = async () => {
	const DEFAULT_LANG = "en";
	const cmsContent = await loadPageContent({ page: "blog" });
	const posts = await loadData<T_RawBlogPostsResponse>({ localPath: `blog/data.json` });

	return {
		props: {
			cmsContent,
			data: Object.values(posts).map((post) => {
				return {
					...post,
					content: post.content[DEFAULT_LANG],
				};
			}),
		},
	};
};
