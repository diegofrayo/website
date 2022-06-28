import BlogPage from "~/components/pages/blog";
import { getPageContentStaticProps } from "~/i18n";
import { ROUTES } from "~/utils/routing";

export default BlogPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
	page: ROUTES.BLOG,
});
