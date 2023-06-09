import BlogPage from "~/features/pages/blog";
import { getPageContentStaticProps } from "~/features/i18n";
import { ROUTES } from "~/features/routing";

export default BlogPage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps = getPageContentStaticProps({
	page: ROUTES.BLOG,
});
