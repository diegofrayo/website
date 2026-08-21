"use client";

import { useEffect, useState } from "react";

import type { Resume } from "@diegofrayo-pkg/types/resume";

import { MainLayout } from "~/components/layout";
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
	const [design, setDesign] = useState<Design>("MINIMALIST");
	const [lang, setLang] = useState<Lang>("EN");
	const [contentMode, setContentMode] = useState<ContentMode>("SHORT");

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
		<MainLayout
			title="Resume"
			contentClassName="win:hidden print:p-0"
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
						<WithAuth>
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
