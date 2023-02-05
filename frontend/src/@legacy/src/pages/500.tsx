import { ErrorPage } from "~/@legacy/src/components/shared";
import { getPageContentStaticProps } from "~/@legacy/src/features/i18n";
import { ROUTES } from "~/@legacy/src/features/routing";

export default ErrorPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
	page: ROUTES.ERROR_500,
});
