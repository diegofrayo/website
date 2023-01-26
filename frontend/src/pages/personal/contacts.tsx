import { ENV_VARS } from "~/@legacy/src/constants";
import ContactsPage from "~/@legacy/src/features/pages/personal/[page]/contacts";
import { getPageContentStaticProps } from "~/@legacy/src/features/i18n";
import http from "~/@legacy/src/lib/http";

export default ContactsPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
	callback: async () => {
		const { data: contacts } = await http.post(
			`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`,
			{
				path: "/data",
				model: "contacts",
			},
		);

		return {
			props: {
				contacts,
			},
		};
	},
});
