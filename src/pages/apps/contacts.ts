import type { GetStaticProps } from "next";

import ContactsPage, { type T_ContactsPageProps } from "~/modules/pages/apps/pages/ContactsPage";
import { loadData } from "~/server/data-loader";

export default ContactsPage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps: GetStaticProps<T_ContactsPageProps> = async () => {
	const data = await loadData<T_ContactsPageProps["data"]>({ page: "contacts" });

	return {
		props: {
			data,
		},
	};
};
