import type { GetStaticProps } from "next";

import HomePage, { type T_HomePageProps } from "~/modules/pages/home/HomePage";
import { loadData, loadPageContent } from "~/server/data-loader";

export default HomePage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps: GetStaticProps<T_HomePageProps> = async () => {
	const cmsContent = await loadPageContent({ page: "home" });
	const data = await loadData<T_HomePageProps["data"]>({ page: "home", remote: true });

	return {
		props: {
			cmsContent,
			data,
		},
	};
};
