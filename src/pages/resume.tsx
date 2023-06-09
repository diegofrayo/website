import ResumePage from "~/features/pages/resume";
import { getPageContentStaticProps } from "~/features/i18n";
import http from "~/lib/http";
import { ENV_VARS } from "~/constants";
import { ROUTES } from "~/features/routing";

export default ResumePage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps = getPageContentStaticProps({
	page: ROUTES.RESUME,
	callback: async () => {
		const { data: resume } = await http.post(
			`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`,
			{
				path: "/data",
				model: "resume",
			},
		);

		return {
			props: {
				resume,
			},
		};
	},
});
