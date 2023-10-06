import type { GetStaticProps } from "next";

import { loadData, loadPageContent } from "~/data/loader";
import ResumePage, { type T_ResumePageProps } from "~/features/pages/resume/page";

export default ResumePage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps: GetStaticProps<T_ResumePageProps> = async () => {
	const DEFAULT_LANG = "en";
	const content = await loadPageContent({ page: "resume" });
	const data = await loadData<T_ResumePageProps["data"]>({
		fullPath: `./src/data/resume/data.${DEFAULT_LANG}.json`,
	});

	return {
		props: {
			content,
			data,
		},
	};
};
