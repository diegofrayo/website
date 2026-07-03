import { useEffect } from "react";

import { useBrowserStorage } from "@diegofrayo-pkg/browser-storage";
import type { Resume } from "@diegofrayo-pkg/types/resume";

import { MainLayout, Page } from "~/components/layout";
import { Box } from "~/components/primitive";
import { WithAuth } from "~/features/auth";

import { ActionButtons, DownloadActions, MinimalistMode, StylishMode } from "./components";
import { IntlContext, IntlProviderValue } from "./resume.context";
import type { ContentMode, Design, Lang } from "./resume.types";

// --- COMPONENT DEFINITION ---

export type ResumePageProps = {
	data: {
		en: Resume;
		es: Resume;
	};
};

function ResumePage({ data }: ResumePageProps) {
	// --- STATE ---
	const [design, setDesign] = useBrowserStorage<Design>({
		key: "DR_RESUME_DESIGN",
		value: "MINIMALIST",
		readInitialValueFromStorage: true,
		saveDuringCreation: true,
	});
	const [lang, setLang] = useBrowserStorage<Lang>({
		key: "DR_RESUME_LANG",
		value: "EN",
		readInitialValueFromStorage: true,
		saveDuringCreation: true,
	});
	const [contentMode, setContentMode] = useBrowserStorage<ContentMode>({
		key: "DR_RESUME_CONTENT_MODE",
		value: "SHORT",
		readInitialValueFromStorage: true,
		saveDuringCreation: true,
	});

	// --- COMPUTED STATES ---
	const currentData: Resume = data[lang.toLowerCase() as Lowercase<typeof lang>];

	// --- EFFECTS ---
	useEffect(
		function injectPrintStyles() {
			const tag = document.getElementById("print-styles");

			if (tag) {
				tag.innerHTML = design === "MINIMALIST" ? MINIMALIST_MODE_STYLES : STYLISH_MODE_STYLES;
			}
		},
		[design],
	);

	return (
		<Page
			config={{
				isSEOEnabled: metadata.is_seo_enabled === true,
				title: metadata.title,
				description: metadata.description,
				pathname: metadata.pathname,
			}}
		>
			<MainLayout
				title={metadata.title}
				contentClassName="print:p-0"
			>
				<IntlContext.Provider value={IntlProviderValue[lang]}>
					<style id="print-styles" />
					<Box className="mx-auto flex max-w-3xl flex-col gap-6 print:max-w-none">
						<Box className="flex w-full flex-col justify-center gap-3 sm:flex-row sm:flex-wrap print:hidden">
							<ActionButtons
								contentMode={contentMode}
								design={design}
								lang={lang}
								onContentModeChange={setContentMode}
								onDesignChange={setDesign}
								onLangChange={setLang}
							/>
							<WithAuth
								roles={["ADMIN"]}
								asChild
							>
								<DownloadActions
									contentMode={contentMode}
									design={design}
									lang={lang}
									onContentModeChange={setContentMode}
									onDesignChange={setDesign}
									onLangChange={setLang}
								/>
							</WithAuth>
						</Box>

						<Box className="text-base">
							{design === "MINIMALIST" ? (
								<MinimalistMode
									contentMode={contentMode}
									data={currentData}
								/>
							) : (
								<StylishMode
									contentMode={contentMode}
									data={currentData}
								/>
							)}
						</Box>
					</Box>
				</IntlContext.Provider>
			</MainLayout>
		</Page>
	);
}

export default ResumePage;

// --- STYLES ---

const MINIMALIST_MODE_STYLES = `
  @media print {
    @page {
      margin: 0cm;
      margin-bottom: 0.5cm;
      margin-top: 0.5cm;
    }

    @page :first {
      margin-top: 0cm;
    }
  }
`;

const STYLISH_MODE_STYLES = `
  @media print {
    @page {
      margin: 0.8cm;
    }
  }
`;

// --- CONSTANTS ---

const metadata = {
	title: "Resume",
	description:
		"I'm Diego, a Systems and Computing Engineer from Universidad del Quindío, Colombia, with 8 years of experience developing web applications. I specialize in front-end development with JavaScript/TypeScript and React/Next.js, and also have experience working with Node.js, ORMs, and SQL/NoSQL databases. I've worked with startups, digital agencies, and as a freelancer. I have a B2 level of English. I'm interested in remote Front-end Developer roles to continue strengthening my experience in this area while further adopting AI in my workflow to improve productivity and maintain a high standard of work.",
	is_seo_enabled: true,
	pathname: "/resume",
};
