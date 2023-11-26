import MusicPage, { MusicService } from "~/features/pages/music";
import getPageContentStaticProps from "~/features/i18n/server";
import { ROUTES } from "~/features/routing";
import { dataFileLoader } from "~/server";

export default MusicPage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps = getPageContentStaticProps({
	page: ROUTES.MUSIC,
	callback: async () => {
		return {
			props: {
				data: await MusicService.fetchSongs(await dataFileLoader("music/data.json")),
			},
		};
	},
});
