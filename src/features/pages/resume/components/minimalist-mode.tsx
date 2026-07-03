import type { Resume } from "@diegofrayo-pkg/types/resume";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";

import { Box, Link, List, Paragraph, Pre, Space, Title } from "~/components/primitive";
import AnalyticsService from "~/features/analytics";

import { useIntl } from "../resume.context";
import type { ContentMode } from "../resume.types";
import { ContactInfo } from "./contact-info";
import { Location } from "./location";
import { OtherSection } from "./other-section";
import { ResumeBox } from "./resume-box";
import { Skill } from "./skill";

type MinimalistModeProps = { data: Resume; contentMode: ContentMode };

export function MinimalistMode({ data, contentMode }: MinimalistModeProps) {
	// --- HOOKS ---
	const texts = useIntl();

	return (
		<Box
			as="section"
			className="border-t border-slate-100 bg-white text-black shadow-sm shadow-slate-200 print:border-0 print:text-sm print:shadow-none"
		>
			<Box
				as="header"
				className="bg-slate-100 p-4 text-center"
			>
				<Title
					as="h1"
					size={Title.size.LG}
				>
					{data.contactInfo.name}
				</Title>

				<Paragraph>{data.contactInfo.label}</Paragraph>
				<Space size={1.5} />

				<ContactInfo
					contactInfo={data.contactInfo}
					variant="SIMPLE"
				/>
				<Space size={1.5} />

				<Location location={data.contactInfo.location} />
			</Box>

			<Box className="p-4">
				<ResumeBox
					variant="SIMPLE"
					title={texts.SUMMARY}
				>
					<Pre
						variant={Pre.variant.BREAK_WITH_BLANK_LINES}
						className="font-texts text-justify"
					>
						{contentMode === "SHORT" ? data.summary.short : data.summary.full}
					</Pre>
				</ResumeBox>

				<ResumeBox
					variant="SIMPLE"
					title={texts.EDUCATION}
				>
					<EducationList education={data.education} />
				</ResumeBox>

				<ResumeBox
					variant="SIMPLE"
					title={texts.EXPERIENCE}
				>
					<ExperienceList
						experience={data.experience}
						contentMode={contentMode}
					/>
				</ResumeBox>

				<OtherSection
					variant="SIMPLE"
					data={data}
				/>
			</Box>
		</Box>
	);
}

function EducationList({ education }: { education: Resume["education"] }) {
	return education.map((item) => {
		return (
			<Box
				key={generateSlug(`short-education-${item.institution}`)}
				className="mb-3 last:mb-0"
			>
				<Paragraph className="-mb-1 font-bold">{`${item.studyType} (${item.area})`}</Paragraph>
				<Link
					variant={Link.variant.SMOOTH}
					href={item.institutionWebsite}
					className="text-sm underline"
					onClick={AnalyticsService.trackClickEvent("RESUME|EDUCATION", {
						item: item.institution,
					})}
					isExternalLink
				>
					{item.institution}
				</Link>
				{item.startDate ? (
					<Paragraph className="text-xs lowercase italic">
						{item.startDate} / {item.endDate}
					</Paragraph>
				) : null}
			</Box>
		);
	});
}

function ExperienceList({
	experience,
	contentMode,
}: {
	experience: Resume["experience"];
	contentMode: ContentMode;
}) {
	// --- HOOKS ---
	const texts = useIntl();

	return experience.map(
		({ id, name, role, company, startDate, endDate, mode, skills, shortContent, fullContent }) => {
			const content = contentMode === "SHORT" ? shortContent : fullContent;

			return (
				<Box
					key={generateSlug(`short-experience-${id}`)}
					className="mb-8 break-inside-avoid last:mb-0"
				>
					<Box className="flex items-end justify-between gap-4">
						<Title
							as="h3"
							variant={Title.variant.UNSTYLED}
							className="truncate leading-none text-black"
						>
							{company.website ? (
								<Link
									variant={Link.variant.SMOOTH}
									href={company.website}
									className="underline"
									onClick={AnalyticsService.trackClickEvent("RESUME|EXPERIENCE", { item: name })}
									isExternalLink
								>
									{name}
								</Link>
							) : (
								<Paragraph>{name}</Paragraph>
							)}
						</Title>
						<Paragraph className="shrink-0 text-right text-xs leading-none lowercase">
							{startDate} - {endDate || texts.PRESENT}
						</Paragraph>
					</Box>
					<Space size={0.5} />
					<Box className="-mt-0.5 flex items-end justify-between gap-4 text-xs italic">
						<Paragraph className="shrink-0 leading-none">{role}</Paragraph>
						<Paragraph className="inline-block text-right leading-none capitalize">
							{mode}
						</Paragraph>
					</Box>
					<Space size={1} />

					<Box className="flex flex-col gap-1">
						<Paragraph>{content.summary}</Paragraph>

						{content.achievements.length > 0 ? (
							<List
								variant={List.variant.SIMPLE}
								className="mx-1"
							>
								{content.achievements.map((achievement, index) => (
									<List.Item key={generateSlug(`short-${id}-achievement-${index}`)}>
										{achievement}
									</List.Item>
								))}
							</List>
						) : null}

						<Box className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-1">
							{skills.map((skill) => (
								<Skill key={generateSlug(`${id}-${skill}`)}>{skill}</Skill>
							))}
						</Box>
					</Box>
				</Box>
			);
		},
	);
}
