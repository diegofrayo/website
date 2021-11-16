import { ErrorPage } from "~/components/shared";
import { getPageContentStaticProps } from "~/i18n";
import { ROUTES } from "~/utils/routing";

export default ErrorPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.ERROR_404,
});
