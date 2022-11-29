import { ENV_VARS } from "~/constants";
import ContactsPage from "~/features/pages/personal/[page]/contacts";
import { getPageContentStaticProps } from "~/features/i18n";
import http from "~/lib/http";

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
