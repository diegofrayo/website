import HomePage from "~/components/pages/home";
import { getPageContentStaticProps } from "~/i18n";
import { ROUTES } from "~/utils/routing";

export default HomePage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.HOME,
});
