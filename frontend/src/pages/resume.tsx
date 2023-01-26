import ResumePage from "~/@legacy/src/features/pages/resume";
import { getPageContentStaticProps } from "~/@legacy/src/features/i18n";
import http from "~/@legacy/src/lib/http";
import { ENV_VARS } from "~/@legacy/src/constants";
import { ROUTES } from "~/@legacy/src/features/routing";

export default ResumePage;

// --- Next.js functions ---

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
