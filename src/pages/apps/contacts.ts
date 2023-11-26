import type { GetStaticProps } from "next";

import ContactsPage from "~/modules/pages/apps/pages/ContactsPage";
import type { T_ContactsPageProps } from "~/modules/pages/apps/types";
import { loadData } from "~/server/data-loader";

export default ContactsPage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps: GetStaticProps<T_ContactsPageProps> = async () => {
	const data = await loadData<T_ContactsPageProps["data"]>({ page: "contacts", remote: true });

	return {
		props: {
			data,
		},
	};
};
