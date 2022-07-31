import MusicPage from "~/features/pages/music";
import { getPageContentStaticProps } from "~/features/i18n";
import { ROUTES } from "~/features/routing";

export default MusicPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
	page: ROUTES.MUSIC,
});
