import type { GetStaticProps } from "next";

import ResumePage, { type T_ResumePageProps } from "~/modules/pages/resume";
import { loadData, loadPageContent } from "~/server/data-loader";

export default ResumePage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps: GetStaticProps<T_ResumePageProps> = async () => {
	const cmsContent = await loadPageContent({ page: "resume" });
	const dataEn = await loadData<T_ResumePageProps["data"][keyof T_ResumePageProps["data"]]>({
		localPath: "_local_/resume/data-en.json",
		remotePath: "resume/en",
		remote: true,
	});

	const dataEs = await loadData<T_ResumePageProps["data"][keyof T_ResumePageProps["data"]]>({
		localPath: "_local_/resume/data-es.json",
		remotePath: "resume/es",
		remote: true,
	});

	return {
		props: {
			cmsContent,
			data: {
				es: dataEs,
				en: dataEn,
			},
		},
	};
};
