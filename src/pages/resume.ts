import type { GetStaticProps } from "next";

import ResumePage, { type T_ResumePageProps } from "~/modules/pages/resume/ResumePage";
import { loadData, loadPageContent } from "~/server/data-loader";

export default ResumePage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps: GetStaticProps<T_ResumePageProps> = async () => {
	const content = await loadPageContent({ page: "resume" });
	const data = await loadData<T_ResumePageProps["data"]>({
		page: "resume",
	});

	return {
		props: {
			content,
			data,
		},
	};
};
