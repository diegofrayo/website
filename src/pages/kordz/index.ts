import type { GetStaticProps } from "next";

import type { T_KordzPageProps } from "~/modules/pages/kordz/KordzPage";
import type { T_RawKordzResponse } from "~/modules/pages/kordz/types";
import { loadData, loadPageContent } from "~/server/data-loader";

export { default } from "~/modules/pages/kordz/KordzPage";

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps: GetStaticProps<T_KordzPageProps> = async () => {
	const cmsContent = await loadPageContent({ page: "kordz" });
	const songs = await loadData<T_RawKordzResponse>({ page: "kordz", remote: true });

	return {
		props: {
			cmsContent,
			data: songs,
		},
	};
};
