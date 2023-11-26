import BlogPage from "~/features/pages/blog";
import getPageContentStaticProps from "~/features/i18n/server";
import { ROUTES } from "~/features/routing";
import BlogService from "~/features/pages/blog/service";
import { dataFileLoader } from "~/server";

export default BlogPage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps = getPageContentStaticProps({
	page: ROUTES.BLOG,
	callback: async () => {
		return {
			props: {
				data: await BlogService.fetchPosts(await dataFileLoader("blog/data.json")),
			},
		};
	},
});
