import path from "path";
import type { GetStaticProps } from "next";

import { readFile } from "@diegofrayo-pkg/utilities/files";

import ResumePage, { type ResumePageProps } from "~/features/pages/resume";

export default ResumePage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps: GetStaticProps<ResumePageProps> = async () => {
	const data = await readFile<ResumePageProps["data"]>(
		path.join(process.cwd(), "src/data/resume.json"),
		"json",
	);

	return {
		props: {
			data: {
				es: data.es,
				en: data.en,
			},
		},
	};
};
