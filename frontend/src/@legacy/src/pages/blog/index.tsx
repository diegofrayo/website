import BlogPage from "~/@legacy/src/features/pages/blog";
import { getPageContentStaticProps } from "~/@legacy/src/features/i18n";
import { ROUTES } from "~/@legacy/src/features/routing";

export default BlogPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
	page: ROUTES.BLOG,
});
