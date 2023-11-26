import { ErrorPage } from "~/components/shared";
import getPageContentStaticProps from "~/features/i18n/server";
import { ROUTES } from "~/features/routing";

export default ErrorPage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps = getPageContentStaticProps({
	page: ROUTES.ERROR_404,
});
