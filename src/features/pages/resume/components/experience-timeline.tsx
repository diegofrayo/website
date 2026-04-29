import type { Resume } from "@diegofrayo-pkg/types/resume";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";
import { isNotEmptyArray, isNotEmptyString } from "@diegofrayo-pkg/validator";

import { Box, Image, InlineText, Link, List, Paragraph, Title } from "~/components/primitive";
import AnalyticsService from "~/features/analytics";

import { useIntl } from "../resume.context";
import type { ContentMode } from "../resume.types";
import { Skill } from "./skill";

type ExperienceTimelineProps = {
	experience: Resume["experience"];
	contentMode: ContentMode;
};

export function ExperienceTimeline({ experience, contentMode }: ExperienceTimelineProps) {
	// --- HOOKS ---
	const texts = useIntl();

	return (
		<Box className="ml-2 border-l-2 border-black print:border-0">
			{experience.map(
				({
					id,
					name,
					role,
					company,
					startDate,
					endDate,
					mode,
					fullContent,
					shortContent,
					skills,
				}) => {
					const content = contentMode === "SHORT" ? shortContent : fullContent;

					return (
						<Box
							key={id}
							as="section"
							className="relative mb-6 pl-8 last:mb-0 sm:pl-10"
							style={{ pageBreakInside: "avoid" }}
						>
							<Box className="absolute top-0 -left-2 size-8 overflow-hidden border-2 border-black bg-white sm:size-10">
								<Image
									src={company.logo}
									alt="Company logo"
									loading="eager"
									useNativeElement
								/>
							</Box>

							<Box className="flex flex-col gap-2">
								<Box>
									<Box className="mb-0.5 flex items-end justify-between gap-4">
										<Title
											as="h3"
											className="text-xl leading-none text-black"
										>
											{isNotEmptyString(company.website) ? (
												<Link
													variant={Link.variant.SMOOTH}
													className="text-black underline"
													href={company.website}
													onClick={AnalyticsService.trackClickEvent("RESUME|EXPERIENCE", {
														item: name,
													})}
													isExternalLink
												>
													{name}
												</Link>
											) : (
												name
											)}
										</Title>
										<Paragraph className="text-xs leading-none lowercase sm:text-sm print:text-xs">
											<InlineText>{startDate}</InlineText> /{" "}
											<InlineText>{endDate || texts.PRESENT}</InlineText>
										</Paragraph>
									</Box>
									<Box className="flex justify-between gap-4 text-xs italic">
										<Paragraph className="shrink-0">{role}</Paragraph>
										<Paragraph className="-mt-0.5 truncate pr-px text-right capitalize">
											{mode}
										</Paragraph>
									</Box>
								</Box>

								<Paragraph>{content.summary}</Paragraph>

								{isNotEmptyArray(content.achievements) ? (
									<List
										variant={List.variant.SIMPLE}
										className="mx-1"
									>
										{content.achievements.map((item, index) => {
											return (
												<List.Item key={generateSlug(`full-${id}-achievements-${index}`)}>
													{item}
												</List.Item>
											);
										})}
									</List>
								) : null}

								<Box className="flex flex-wrap items-center gap-x-1 gap-y-1">
									{skills.map((skill) => {
										return <Skill key={generateSlug(`${id}-${skill}`)}>{skill}</Skill>;
									})}
								</Box>
							</Box>
						</Box>
					);
				},
			)}
		</Box>
	);
}
