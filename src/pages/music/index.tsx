import MusicPage from "~/components/pages/music";
import { getPageContentStaticProps } from "~/i18n";
import { ROUTES } from "~/utils/routing";

export default MusicPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.MUSIC,
});
