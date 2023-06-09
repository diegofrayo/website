import { ENV_VARS } from "~/constants";
import BusinessesPage from "~/features/pages/personal/[page]/businesses";
import { getPageContentStaticProps } from "~/features/i18n";
import http from "~/lib/http";

export default BusinessesPage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps = getPageContentStaticProps({
	callback: async () => {
		const { data: businesses } = await http.post(
			`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`,
			{
				path: "/data",
				model: "businesses",
			},
		);

		return {
			props: {
				data: businesses,
			},
		};
	},
});
