import MusicPage from "~/@legacy/src/features/pages/music";
import { getPageContentStaticProps } from "~/@legacy/src/features/i18n";
import { ROUTES } from "~/@legacy/src/features/routing";

export default MusicPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
	page: ROUTES.MUSIC,
});
