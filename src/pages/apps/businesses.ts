import type { GetStaticProps } from "next";

import BusinessesPage, {
	type T_BusinessesPageProps,
} from "~/modules/pages/apps/pages/BusinessesPage";
import { loadData } from "~/server/data-loader";

export default BusinessesPage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps: GetStaticProps<T_BusinessesPageProps> = async () => {
	const data = await loadData<T_BusinessesPageProps["data"]>({
		fullPath: `./src/data/_private/businesses/data.json`,
		remotePath: "businesses",
	});

	return {
		props: {
			data,
		},
	};
};
