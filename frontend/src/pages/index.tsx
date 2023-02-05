import { GetStaticProps } from "next";

import HomePage from "~/modules/pages/index/page";
import DATA from "~/modules/pages/index/data.json";

export default HomePage;

// --- Next.js functions ---

export const getStaticProps: GetStaticProps = async () => {
	return {
		props: {
			data: DATA,
		},
	};
};
