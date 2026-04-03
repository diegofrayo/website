import { useEffect, useState } from "react";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import type { Resume } from "@diegofrayo-pkg/types/resume";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";
import { isNotEmptyArray, isNotEmptyString } from "@diegofrayo-pkg/validator";
import AnalyticsService from "@diegofrayo-features/analytics";
import {
	Box,
	Button,
	Icon,
	IconCatalog,
	Image,
	InlineText,
	Link,
	List,
	Pre,
	Space,
	Text,
	Title,
} from "@diegofrayo-features/components/primitive";

import { MainLayout, Page } from "~/components/layout";

import { IntlContext, IntlProviderValue, useIntl } from "./resume.context";

// --- COMPONENT DEFINITION ---

export type ResumePageProps = {
	data: {
		en: Resume;
		es: Resume;
	};
};

function ResumePage({ data }: ResumePageProps) {
	// --- STATE ---
	const [viewMode, setViewMode] = useState<"FULL" | "SHORT">("SHORT");
	const [lang, setLang] = useState<"ES" | "EN">("EN");

	// --- COMPUTED STATES ---
	const currentData: Resume = data[lang.toLowerCase() as Lowercase<typeof lang>];

	// --- EFFECTS ---
	useEffect(
		function injectPrintStyles() {
			const tag = document.getElementById("print-styles");

			if (tag) {
				tag.innerHTML = viewMode === "SHORT" ? SHORT_MODE_STYLES : FULL_MODE_STYLES;
			}
		},
		[viewMode],
	);

	// --- HANDLERS ---
	function handleToggleViewModeClick() {
		setViewMode((currentState) => {
			const newState = currentState === "FULL" ? "SHORT" : "FULL";
			AnalyticsService.trackEvent("RESUME|SET_VIEW_MODE", { view_mode: newState });

			return newState;
		});
	}

	function handleToggleLangClick() {
		setLang((currentState) => {
			const newState = currentState === "ES" ? "EN" : "ES";
			AnalyticsService.trackEvent("RESUME|SET_LANG", { lang: newState });

			return newState;
		});
	}
	// --- UTILS ---
	function getSelectedPDFLink() {
		const LINKS = {
			"EN-SHORT":
				"https://drive.google.com/file/d/1FXgV7ivut-qXpoztv7VPIhHtF-fzXJZn/view?usp=sharing",
			"EN-FULL":
				"https://drive.google.com/file/d/1b3kvK6ef_Z1UeD5IE_Y8Y8go-JjNRIPv/view?usp=sharing",
			"ES-SHORT":
				"https://drive.google.com/file/d/1FXgV7ivut-qXpoztv7VPIhHtF-fzXJZn/view?usp=sharing",
			"ES-FULL":
				"https://drive.google.com/file/d/1b3kvK6ef_Z1UeD5IE_Y8Y8go-JjNRIPv/view?usp=sharing",
		};

		return LINKS[`${lang}-${viewMode}`];
	}

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
					<Box className="mx-auto max-w-3xl print:max-w-none">
						<Box className="mb-4 flex justify-center gap-2 text-sm font-bold print:hidden">
							<Button
								variant={Button.variant.STYLED}
								className="w-36"
								onClick={handleToggleViewModeClick}
							>
								<InlineText className="mr-0.5">Version:</InlineText>
								<Icon
									icon={viewMode === "SHORT" ? IconCatalog.EXPAND : IconCatalog.SHRINK}
									size={viewMode === "SHORT" ? 12 : 16}
								/>
							</Button>

							<Button
								variant={Button.variant.STYLED}
								className="w-28 sm:w-36"
								onClick={handleToggleLangClick}
							>
								<InlineText className="mr-0.5">Lang:</InlineText>
								<InlineText>{lang}</InlineText>
							</Button>

							<Button
								variant={Button.variant.STYLED}
								className="sm:w-36"
								render={
									<Link
										href={getSelectedPDFLink()}
										onClick={AnalyticsService.trackClickEvent("RESUME|DOWNLOAD_AS_PDF", {
											version: viewMode,
											lang,
										})}
										className="flex items-center justify-center"
										isExternalLink
									/>
								}
							>
								<Icon
									className="mr-0.5"
									icon={IconCatalog.DOWNLOAD}
								/>
								<InlineText>PDF</InlineText>
							</Button>
						</Box>

						<Box className="text-base">
							{viewMode === "FULL" ? (
								<FullMode data={currentData} />
							) : (
								<ShortMode data={currentData} />
							)}
						</Box>
					</Box>
				</IntlContext.Provider>
			</MainLayout>
		</Page>
	);
}

export default ResumePage;

// --- COMPONENTS ---

function ShortMode({ data }: { data: Resume }) {
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

				<Text>{data.contactInfo.label}</Text>
				<Space size={1.5} />

				<Box className="grid grid-cols-1 gap-x-3 gap-y-1 text-black sm:grid-cols-2">
					<Link
						variant={Link.variant.SMOOTH}
						href={`mailto:${data.contactInfo.email}`}
						className="inline-flex shrink-0 items-center justify-center gap-0.5 sm:justify-end"
						isExternalLink
					>
						<Icon
							icon={IconCatalog.MAILS}
							size={16}
						/>
						<InlineText className="text-sm font-semibold">{data.contactInfo.email}</InlineText>
					</Link>
					<Link
						variant={Link.variant.SMOOTH}
						href={data.contactInfo.website}
						className="inline-flex shrink-0 items-center justify-center gap-0.5 sm:justify-start"
						isExternalLink
					>
						<Icon
							icon={IconCatalog.GLOBE}
							size={16}
						/>
						<InlineText className="text-sm font-semibold">
							{data.contactInfo.website.replace("https://", "")}
						</InlineText>
					</Link>
					<Link
						variant={Link.variant.SMOOTH}
						href={data.contactInfo.profiles[0].url}
						className="inline-flex shrink-0 items-center justify-center gap-0.5 sm:justify-end"
						isExternalLink
					>
						<Icon
							icon={IconCatalog.LINKEDIN_MONO}
							className="size-4"
						/>
						<InlineText className="text-sm font-semibold">
							{data.contactInfo.profiles[0].url.replace("https://www.", "")}
						</InlineText>
					</Link>
					<Link
						variant={Link.variant.SMOOTH}
						href={data.contactInfo.profiles[1].url}
						className="inline-flex shrink-0 items-center justify-center gap-0.5 sm:justify-start"
						isExternalLink
					>
						<Icon
							icon={IconCatalog.GITHUB_MONO}
							className="size-4"
						/>
						<InlineText className="text-sm font-semibold">
							{data.contactInfo.profiles[1].url.replace("https://www.", "")}
						</InlineText>
					</Link>
				</Box>
				<Space size={1.5} />

				<Location location={data.contactInfo.location} />
			</Box>

			<Box className="p-4">
				<ResumeBox
					variant="SHORT"
					title={texts.SUMMARY}
				>
					<Pre
						variant={Pre.variant.BREAK_WITH_BLANK_LINES}
						className="font-texts text-justify"
					>
						{data.summary.short}
					</Pre>
				</ResumeBox>

				<ResumeBox
					variant="SHORT"
					title={texts.EDUCATION}
				>
					{data.education.map((item) => {
						return (
							<Box
								key={generateSlug(`short-education-${item.institution}`)}
								className="mb-3 last:mb-0"
							>
								<Text className="-mb-1 font-bold">{`${item.studyType} (${item.area})`}</Text>
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
									<Text className="text-xs lowercase italic">
										<InlineText>{item.startDate}</InlineText> /{" "}
										<InlineText>{item.endDate}</InlineText>
									</Text>
								) : null}
							</Box>
						);
					})}
				</ResumeBox>

				<ResumeBox
					variant="SHORT"
					title={texts.EXPERIENCE}
				>
					{data.experience.map(
						({ id, name, role, company, startDate, endDate, mode, shortContent, skills }) => {
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
											{isNotEmptyString(company.website) ? (
												<Link
													variant={Link.variant.SMOOTH}
													href={company.website}
													className="underline"
													onClick={AnalyticsService.trackClickEvent("RESUME|EXPERIENCE", {
														item: name,
													})}
													isExternalLink
												>
													{name}
												</Link>
											) : (
												<Text>{name}</Text>
											)}
										</Title>
										<Text className="shrink-0 text-right text-xs leading-none lowercase">
											{startDate} - {endDate || texts.PRESENT}
										</Text>
									</Box>
									<Space size={0.5} />
									<Box className="-mt-0.5 flex items-end justify-between gap-4 text-xs italic">
										<Text className="shrink-0 leading-none">{role}</Text>
										<Text className="inline-block text-right leading-none capitalize">{mode}</Text>
									</Box>
									<Space size={1} />

									<Box className="flex flex-col gap-1">
										<Text>{shortContent.summary}</Text>

										{isNotEmptyArray(shortContent.achievements) ? (
											<List
												variant={List.variant.SIMPLE}
												className="mx-1"
											>
												{shortContent.achievements.map((achievement, index) => {
													return (
														<List.Item key={generateSlug(`short-${id}-achievement-${index}`)}>
															{achievement}
														</List.Item>
													);
												})}
											</List>
										) : null}

										<Box className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-1">
											{skills.map((skill, index) => {
												return (
													<Skill
														key={generateSlug(`${id}-${skill}`)}
														className={cn({ "print:hidden": index > 7 })}
													>
														{skill}
													</Skill>
												);
											})}
										</Box>
									</Box>
								</Box>
							);
						},
					)}
				</ResumeBox>

				<OtherSection
					variant="SHORT"
					data={data}
				/>
			</Box>
		</Box>
	);
}

function FullMode({ data }: { data: Resume }) {
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

				<Text>{data.contactInfo.label}</Text>
				<Space size={1} />

				<Location location={data.contactInfo.location} />
				<Space size={2} />

				<Box className="flex items-center justify-center gap-3">
					<Link
						variant={Link.variant.SMOOTH}
						href={`mailto:${data.contactInfo.email}`}
						className="-mr-1 inline-block"
						onClick={AnalyticsService.trackClickEvent("RESUME|SOCIAL_NETWORK", {
							item: "email",
						})}
						isExternalLink
					>
						<Icon
							icon={IconCatalog.GMAIL}
							size={44}
						/>
					</Link>
					<Link
						variant={Link.variant.SMOOTH}
						href={data.contactInfo.website}
						className="inline-block"
						onClick={AnalyticsService.trackClickEvent("RESUME|SOCIAL_NETWORK", {
							item: "website",
						})}
						isExternalLink
					>
						<Icon
							icon={IconCatalog.WEBSITE}
							size={30}
						/>
					</Link>
					<Link
						variant={Link.variant.SMOOTH}
						href={data.contactInfo.profiles[0].url}
						className="inline-block"
						onClick={AnalyticsService.trackClickEvent("RESUME|SOCIAL_NETWORK", {
							item: data.contactInfo.profiles[0].network,
						})}
						isExternalLink
					>
						<Icon
							icon={IconCatalog.LINKEDIN}
							size={30}
						/>
					</Link>
					<Link
						variant={Link.variant.SMOOTH}
						href={data.contactInfo.profiles[1].url}
						className="inline-block"
						onClick={AnalyticsService.trackClickEvent("RESUME|SOCIAL_NETWORK", {
							item: data.contactInfo.profiles[1].network,
						})}
						isExternalLink
					>
						<Icon
							icon={IconCatalog.GITHUB}
							size={30}
						/>
					</Link>
				</Box>
			</Box>

			<ResumeBox
				variant="FULL"
				title={texts.SUMMARY}
			>
				<Pre
					variant={Pre.variant.BREAK_WITH_BLANK_LINES}
					className="font-texts text-justify"
				>
					{data.summary.full}
				</Pre>
			</ResumeBox>

			<ResumeBox
				variant="FULL"
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
										<Text className="text-xs lowercase italic">
											<InlineText>{item.startDate}</InlineText> /{" "}
											<InlineText>{item.endDate}</InlineText>
										</Text>
									) : null}
								</Box>
							</Box>
						);
					})}
				</Box>
			</ResumeBox>

			<ResumeBox
				variant="FULL"
				title={texts.EXPERIENCE}
			>
				<ExperienceTimeline experience={data.experience} />
			</ResumeBox>

			<OtherSection
				data={data}
				variant="FULL"
			/>
		</Box>
	);
}

type ResumeBoxProps = {
	title: string;
	children: ReactTypes.Children;
	variant: "SHORT" | "FULL";
	style?: ReactTypes.Styles;
};

function ResumeBox({ title, children, variant, style }: ResumeBoxProps) {
	if (variant === "SHORT") {
		return (
			<Box
				as="section"
				className="mb-6 last:mb-0"
				style={style}
			>
				<Title
					as="h2"
					variant={Title.variant.UNSTYLED}
					className="mb-3 border-b border-dashed text-left text-xl uppercase"
				>
					{title}
				</Title>
				<Box className="px-1">{children}</Box>
			</Box>
		);
	}

	return (
		<Box
			as="section"
			className="mt-12"
			style={{ pageBreakInside: "avoid" }}
		>
			<Title
				as="h2"
				className="mb-4 border-black bg-black px-4 py-2 text-left text-white uppercase"
				size={Title.size.LG}
			>
				{title}
			</Title>
			<Box className="px-2">{children}</Box>
		</Box>
	);
}

function Skill({ children, className }: { children: string; className?: string }) {
	return (
		<InlineText
			className={cn(
				"inline-block border border-slate-300 bg-slate-100 px-1.5 py-0.5 pt-1 font-mono text-xs leading-tight font-semibold text-slate-600",
				className,
			)}
		>
			{children.trim()}
		</InlineText>
	);
}

type ExperienceTimelineProps = {
	experience: Resume["experience"];
};

function ExperienceTimeline({ experience }: ExperienceTimelineProps) {
	// --- HOOKS ---
	const texts = useIntl();

	return (
		<Box className="ml-2 border-l-2 border-black print:border-0">
			{experience.map(
				({ id, name, role, company, startDate, endDate, mode, fullContent, skills }) => {
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
									fill
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
										<Text className="text-xs leading-none lowercase sm:text-sm print:text-xs">
											<InlineText>{startDate}</InlineText> /{" "}
											<InlineText>{endDate || texts.PRESENT}</InlineText>
										</Text>
									</Box>
									<Box className="flex justify-between gap-4 text-xs italic">
										<Text className="shrink-0">{role}</Text>
										<Text className="-mt-0.5 truncate pr-px text-right capitalize">{mode}</Text>
									</Box>
								</Box>

								<Text>{fullContent.summary}</Text>

								{isNotEmptyArray(fullContent.achievements) ? (
									<List
										variant={List.variant.SIMPLE}
										className="mx-1"
									>
										{fullContent.achievements.map((item, index) => {
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

function OtherSection({ data, variant }: { data: Resume; variant: "SHORT" | "FULL" }) {
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
								<Text>{texts[`SKILLS_L${index + 1}` as keyof typeof texts]}:</Text>
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

			<Space size={2} />

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

function Location({ location }: { location: Resume["contactInfo"]["location"] }) {
	return (
		<Text className="text-xs">
			<Icon
				icon={IconCatalog.MAP_PIN}
				wrapperClassName="mr-0.5"
			/>
			<InlineText className="align-middle">{`${location.city}, ${location.country} (${location.timezone})`}</InlineText>
		</Text>
	);
}

// --- STYLES ---

const SHORT_MODE_STYLES = `
  @media print {
    @page {
      margin: 0cm;
      margin-bottom: 0.5cm;
      margin-top: 0.5cm;
    }

    @page :first {
      margin-bottom: 0cm;
      margin-top: 0cm;
    }
  }
`;

const FULL_MODE_STYLES = `
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
		"I'm Diego, a Systems and Computing Engineer from Universidad del Quindío, Colombia, with 8 years of experience developing web applications. I specialize in front-end development with JavaScript/TypeScript and React/Next.js, and also have experience working with Node.js, ORMs, and SQL/NoSQL databases. I’ve worked with startups, digital agencies, and as a freelancer. I have a B2 level of English. I'm interested in remote Front-end Developer roles to continue strengthening my experience in this area while further adopting AI in my workflow to improve productivity and maintain a high standard of work.",
	is_seo_enabled: true,
	pathname: "/resume",
};
