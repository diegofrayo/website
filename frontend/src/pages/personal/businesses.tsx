import { ENV_VARS } from "~/@legacy/src/constants";
import BusinessesPage from "~/@legacy/src/features/pages/personal/[page]/businesses";
import { getPageContentStaticProps } from "~/@legacy/src/features/i18n";
import http from "~/@legacy/src/lib/http";

export default BusinessesPage;

// --- Next.js functions ---

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
				businesses: businesses.categories,
			},
		};
	},
});
