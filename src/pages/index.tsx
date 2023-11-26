import HomePage from "~/features/pages/home";
import getPageContentStaticProps from "~/features/i18n/server";
import { ROUTES } from "~/features/routing";

export default HomePage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps = getPageContentStaticProps({
	page: ROUTES.HOME,
	callback: async () => {
		return {
			props: {
				data: {
					featured: [],
				},
			},
		};
	},
});
