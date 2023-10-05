import HomePage from "~/features/pages/home";
import { getPageContentStaticProps } from "~/features/i18n";
import { ROUTES } from "~/features/routing";

export default HomePage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps = getPageContentStaticProps({
	page: ROUTES.HOME,
	callback: async () => {
		return {
			props: {
				data: {
					featured: [
						{
							text: "/d/contacts",
							url: "/personal/contacts",
						},
						{
							text: "/d/businesses",
							url: "/personal/businesses",
						},
						{
							text: "/t/dencrypt",
							url: "/personal/dencrypt",
						},
						{
							text: "/t/whatsapp",
							url: "/personal/whatsapp",
						},
					],
				},
			},
		};
	},
});
