import type ReactTypes from "@diegofrayo-pkg/types/react";
import type { Resume } from "@diegofrayo-pkg/types/resume";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";

import { Box, List, Paragraph, Separator } from "~/components/primitive";

import { useIntl } from "../resume.context";
import { ResumeBox } from "./resume-box";
import { Skill } from "./skill";

export function OtherSection({
	data,
	variant,
}: {
	data: Resume;
	variant: "SIMPLE" | "STYLISH";
}): ReactTypes.JSXElement {
	// --- HOOKS ---
	const texts = useIntl();

	return (
		<>
			<ResumeBox
				variant={variant}
				title={texts.SKILLS}
				style={{ pageBreakInside: "avoid" }}
			>
				<List
					variant={List.variant.SIMPLE}
					className="ml-1"
				>
					{data.skills.map((item, index) => {
						return (
							<List.Item key={generateSlug(`skills-label-${item.category}`)}>
								<Paragraph>{texts[`SKILLS_L${index + 1}` as keyof typeof texts]}:</Paragraph>
								<Box className="mt-1 mb-3 flex flex-wrap items-center gap-x-1 gap-y-1">
									{item.items.map((item) => {
										return <Skill key={`skills-tech-stack-${item}`}>{item}</Skill>;
									})}
								</Box>
							</List.Item>
						);
					})}
				</List>
			</ResumeBox>

			<Separator size={2} />

			<ResumeBox
				variant={variant}
				title={texts.LANGUAGES}
				style={{ pageBreakInside: "avoid" }}
			>
				<List
					variant={List.variant.SIMPLE}
					className="ml-1"
				>
					{data.languages.map((item) => {
						return (
							<List.Item
								key={generateSlug(`languages-${item.language}`)}
							>{`${item.language} (${item.fluency})`}</List.Item>
						);
					})}
				</List>
			</ResumeBox>
		</>
	);
}
