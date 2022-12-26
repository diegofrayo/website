import HomePage from "~/features/pages/home";
import { getPageContentStaticProps } from "~/features/i18n";
import http from "~/lib/http";
import { ENV_VARS } from "~/constants";
import { ROUTES } from "~/features/routing";

export default HomePage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
	page: ROUTES.HOME,
	callback: async () => {
		return {
			props: {
				data: (
					await http.post(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
						path: "/data",
						model: "home",
					})
				).data,
			},
		};
	},
});
