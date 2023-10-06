import type { GetStaticProps } from "next";

import HomePage, { type T_HomePageProps } from "~/features/pages/home/page";
import { loadData, loadPageContent } from "~/data/loader";

export default HomePage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps: GetStaticProps<T_HomePageProps> = async () => {
	const content = await loadPageContent({ page: "home" });
	const data = await loadData<T_HomePageProps["data"]>({ page: "home" });

	return {
		props: {
			content,
			data,
		},
	};
};
