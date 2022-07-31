import BlogPage from "~/features/pages/blog";
import { getPageContentStaticProps } from "~/features/i18n";
import { ROUTES } from "~/features/routing";

export default BlogPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
	page: ROUTES.BLOG,
});
