import type { Resume } from "@diegofrayo-pkg/types/resume";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";

import { Box, Image, InlineText, Link, Paragraph, Pre, Space, Title } from "~/components/primitive";
import AnalyticsService from "~/features/analytics";

import { useIntl } from "../resume.context";
import type { ContentMode } from "../resume.types";
import { ContactInfo } from "./contact-info";
import { ExperienceTimeline } from "./experience-timeline";
import { Location } from "./location";
import { OtherSection } from "./other-section";
import { ResumeBox } from "./resume-box";

type StylishModeProps = { data: Resume; contentMode: ContentMode };

export function StylishMode({ data, contentMode }: StylishModeProps) {
	// --- HOOKS ---
	const texts = useIntl();

	return (
		<Box
			as="section"
			className="relative border-t border-slate-50 bg-white px-2 py-16 text-black shadow-sm shadow-slate-200 md:px-8 print:border-0 print:py-0 print:text-sm print:shadow-none"
		>
			<Box
				as="header"
				className="text-center print:pt-12"
			>
				<Title
					as="h1"
					variant={Title.variant.SIMPLE}
					size={Title.size.XL}
				>
					{data.contactInfo.name}
				</Title>
				<Space size={1} />

				<Paragraph>{data.contactInfo.label}</Paragraph>
				<Space size={1} />

				<Location location={data.contactInfo.location} />
				<Space size={2} />

				<ContactInfo
					contactInfo={data.contactInfo}
					variant="STYLISH"
				/>
			</Box>

			<ResumeBox
				variant="STYLISH"
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
				variant="STYLISH"
				title={texts.EDUCATION}
			>
				<Box>
					{data.education.map((item) => {
						return (
							<Box
								key={generateSlug(`short-education-${item.institution}`)}
								className="mb-4 flex items-start last:mb-0"
							>
								<Image
									src={item.institutionLogo}
									alt={`${item.institution} logo`}
									className="relative top-1 mr-2 shrink-0"
									width={48}
									height={48}
								/>
								<Box>
									<Title
										as="h3"
										className="text-xl"
									>
										{`${item.studyType} (${item.area})`}
									</Title>
									<Link
										variant={Link.variant.SMOOTH}
										href={item.institutionWebsite}
										className="underline"
										onClick={AnalyticsService.trackClickEvent("RESUME|EDUCATION", {
											item: item.institution,
										})}
										isExternalLink
									>
										{item.institution}
									</Link>
									{item.startDate ? (
										<Paragraph className="text-xs lowercase italic">
											<InlineText>{item.startDate}</InlineText> /{" "}
											<InlineText>{item.endDate}</InlineText>
										</Paragraph>
									) : null}
								</Box>
							</Box>
						);
					})}
				</Box>
			</ResumeBox>

			<ResumeBox
				variant="STYLISH"
				title={texts.EXPERIENCE}
			>
				<ExperienceTimeline
					experience={data.experience}
					contentMode={contentMode}
				/>
			</ResumeBox>

			<OtherSection
				data={data}
				variant="STYLISH"
			/>
		</Box>
	);
}
