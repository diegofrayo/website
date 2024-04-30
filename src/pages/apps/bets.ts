import type { GetStaticProps } from "next";

import BetsPage from "~/modules/pages/apps/pages/BetsPage";
import type { T_BetsPageProps } from "~/modules/pages/apps/pages/BetsPage";
import { loadData } from "~/server/data-loader";

export default BetsPage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps: GetStaticProps<T_BetsPageProps> = async () => {
	let data;

	try {
		data = await loadData<T_BetsPageProps["data"]>({ localPath: "_local_/bets.json" });
	} catch (error) {
		data = {};
	}

	return {
		props: {
			data,
		},
	};
};
