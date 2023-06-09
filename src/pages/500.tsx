import { ErrorPage } from "~/components/shared";
import { getPageContentStaticProps } from "~/features/i18n";
import { ROUTES } from "~/features/routing";

export default ErrorPage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps = getPageContentStaticProps({
	page: ROUTES.ERROR_500,
});
