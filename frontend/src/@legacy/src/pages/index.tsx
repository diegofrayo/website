import HomePage from "~/@legacy/src/features/pages/home";
import { getPageContentStaticProps } from "~/@legacy/src/features/i18n";
import http from "~/@legacy/src/lib/http";
import { ENV_VARS } from "~/@legacy/src/constants";
import { ROUTES } from "~/@legacy/src/features/routing";

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
