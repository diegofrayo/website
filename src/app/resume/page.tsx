import path from "path";
import type { Metadata } from "next";

import { readFile } from "@diegofrayo-pkg/utilities/files";

import { PersonScript } from "~/components/common";
import { ASSETS_ROOT_PATH, WEBSITE_METADATA } from "~/constants";
import ResumePage, { type ResumePageProps } from "~/features/pages/resume";

// --- METADATA ---

export const metadata: Metadata = {
	title: "Resume",
	alternates: { canonical: "/resume" },
	openGraph: {
		type: "article",
		url: "/resume",
		siteName: WEBSITE_METADATA.title,
		images: `${ASSETS_ROOT_PATH}/meta-og-image.png`,
	},
};

// --- COMPONENT DEFINITION ---

function Resume() {
	const data = readFile<ResumePageProps["data"]>(
		path.join(process.cwd(), "src/data/resume.json"),
		"json",
	);

	return (
		<>
			<PersonScript />
			<ResumePage data={{ es: data.es, en: data.en }} />
		</>
	);
}

export default Resume;
