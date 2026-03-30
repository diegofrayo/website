import { useEffect, useState } from "react";
import { GithubIcon, GlobeIcon, LinkedinIcon, MailIcon } from "lucide-react";

import cn from "@diegofrayo-pkg/cn";
import type DR from "@diegofrayo-pkg/types";
import type { Resume } from "@diegofrayo-pkg/types/resume";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";
import { isNotEmptyArray, isNotEmptyString } from "@diegofrayo-pkg/validator";
import AnalyticsService from "@diegofrayo-features/analytics";
import { WithAuth } from "@diegofrayo-features/auth";
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
			"ES-SHORT":
				"https://drive.google.com/file/d/10_g1xNAUaZWnZSxRh2ud2cayG85daxhL/view?usp=sharing",
			"ES-FULL":
				"https://drive.google.com/file/d/10Zb7kWhV0_M5veA_5RH-N6uJYNyrwHR6/view?usp=sharing",
			"EN-SHORT":
				"https://drive.google.com/file/d/10_Kj8LhLN99nQLA9S0BMyas_VHDtjXrA/view?usp=sharing",
			"EN-FULL":
				"https://drive.google.com/file/d/10Z1-PEvIrilz9SbXef2KLY88ILSFbj7N/view?usp=sharing",
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
			<MainLayout title={metadata.title}>
				<IntlContext.Provider value={IntlProviderValue[lang]}>
					<style id="print-styles" />
					<Box className="mx-auto max-w-3xl print:max-w-none">
						<Box className="mb-4 flex justify-center gap-2 text-sm font-bold print:hidden">
							<WithAuth
								roles={["ADMIN"]}
								asChild
							>
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
							</WithAuth>

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
		<Box className="border border-zinc-300 bg-white text-black">
			<Box
				as="header"
				className="border-b border-zinc-300 bg-zinc-200 p-4 text-center"
			>
				<Title
					as="h1"
					size={Title.size.LG}
				>
					{data.contactInfo.name}
				</Title>

				<Text>{data.contactInfo.label}</Text>
				<Space size={1.5} />

				<Box className="flex items-center justify-center gap-3 text-black">
					<Link
						variant={Link.variant.SMOOTH}
						href={`mailto:${data.contactInfo.email}`}
						className="font-bold text-zinc-800 underline"
						isExternalLink
					>
						<MailIcon size={24} />
					</Link>
					<Link
						variant={Link.variant.SMOOTH}
						href={data.contactInfo.website}
						className="font-bold text-zinc-800 underline"
						isExternalLink
					>
						<GlobeIcon size={24} />
					</Link>
					<Link
						variant={Link.variant.SMOOTH}
						href={data.contactInfo.profiles[1].url}
						className="font-bold text-zinc-800 underline"
						isExternalLink
					>
						<LinkedinIcon size={24} />
					</Link>
					<Link
						variant={Link.variant.SMOOTH}
						href={data.contactInfo.profiles[0].url}
						className="font-bold text-zinc-800 underline"
						isExternalLink
					>
						<GithubIcon size={24} />
					</Link>
				</Box>
				<Space size={1.5} />

				<Text className="text-xs">
					<Icon
						icon={IconCatalog.MAP_PIN}
						wrapperClassName="mr-0.5"
					/>
					<InlineText className="align-middle">{`${data.contactInfo.location.address} (${data.contactInfo.location.countryCode})`}</InlineText>
				</Text>
			</Box>

			<Box className="p-4">
				<ResumeBox
					variant="SHORT"
					title={texts.SUMMARY}
				>
					{data.summary}
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
								<Text className="-mb-1 font-bold">{`${item.area} (${item.studyType})`}</Text>
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
					{data.experience.map((item) => {
						return (
							<Box
								key={generateSlug(`short-experience-${item.id}`)}
								className="mb-8 break-inside-avoid last:mb-0"
							>
								<Box className="flex items-end justify-between gap-4">
									<Title
										as="h3"
										variant={Title.variant.UNSTYLED}
										className="truncate leading-none text-black"
									>
										{isNotEmptyString(item.company.website) ? (
											<Link
												variant={Link.variant.SMOOTH}
												href={item.company.website}
												className="underline"
												onClick={AnalyticsService.trackClickEvent("RESUME|EXPERIENCE", {
													item: item.name,
												})}
												isExternalLink
											>
												{item.name}
											</Link>
										) : (
											<Text>{item.name}</Text>
										)}
									</Title>
									<Text className="shrink-0 text-right text-xs leading-none lowercase">
										{item.startDate} - {item.endDate || texts.PRESENT}
									</Text>
								</Box>
								<Space size={0.5} />
								<Box className="flex items-end justify-between gap-4 text-xs italic">
									<Text className="shrink-0 leading-none">{item.role}</Text>
									<Text className="inline-block text-right leading-none capitalize">
										{item.mode}
									</Text>
								</Box>
								<Space size={1} />

								<Box className="flex flex-col gap-1">
									<Text>{item.summary}</Text>

									{isNotEmptyArray(item.achievements) ? (
										<List
											variant={List.variant.SIMPLE}
											className="mx-1"
										>
											{item.achievements.map((achievement, index) => {
												return (
													<List.Item key={generateSlug(`short-${item.id}-achievement-${index}`)}>
														{achievement}
													</List.Item>
												);
											})}
										</List>
									) : null}

									<Box className="flex flex-wrap items-center gap-x-1 gap-y-1">
										{item.skills.map((skill, index) => {
											return (
												<Skill
													key={generateSlug(`${item.id}-${skill}`)}
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
					})}
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
		<Box className="relative border border-black bg-white px-2 py-16 text-black md:px-8 print:py-0">
			<Box
				as="header"
				className="text-center"
			>
				<Title
					as="h1"
					variant={Title.variant.SIMPLE}
					size={Title.size.XL}
				>
					{data.contactInfo.name}
				</Title>
				<Space size={2} />

				<Text>{data.contactInfo.label}</Text>
				<Space size={1} />

				<Text className="text-sm italic">
					<InlineText className="align-middle">{`${data.contactInfo.location.address} (${data.contactInfo.location.countryCode})`}</InlineText>
				</Text>
				<Space size={2} />

				<Box className="flex items-center justify-center gap-2">
					<Link
						variant={Link.variant.SMOOTH}
						href={`mailto:${data.contactInfo.email}`}
						className="inline-block"
						onClick={AnalyticsService.trackClickEvent("RESUME|SOCIAL_NETWORK", {
							item: "email",
						})}
						isExternalLink
					>
						<Icon
							icon={IconCatalog.GMAIL}
							size={36}
							iconClassName="p-1"
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
							icon={IconCatalog.LINK}
							size={28}
							color="text-black"
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
							size={36}
							iconClassName="p-1"
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
							size={36}
							iconClassName="p-1"
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
					{data.summary}
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
										size={Title.size.MD}
									>
										{item.area}
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
	children: DR.React.Children;
	variant: "SHORT" | "FULL";
	style?: DR.React.Styles;
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
					className="mb-1 text-left text-xl uppercase"
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
				className="mb-4 border border-black px-4 py-2 text-left uppercase"
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
				"inline-block rounded-md border border-zinc-400 bg-zinc-200 px-2.5 py-1 font-mono text-xs leading-tight font-semibold text-zinc-700",
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
				({ id, name, role, company, startDate, endDate, summary, mode, achievements, skills }) => {
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

							<Box>
								<Box>
									<Box className="mb-0.5 flex items-end justify-between gap-4">
										<Title
											as="h3"
											size={Title.size.SM}
											className="leading-none text-black"
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
										<Text className="text-xs lowercase sm:text-sm">
											<InlineText>{startDate}</InlineText> /{" "}
											<InlineText>{endDate || texts.PRESENT}</InlineText>
										</Text>
									</Box>
									<Box className="flex justify-between gap-4 text-xs italic">
										<Text className="shrink-0">{role}</Text>
										<Text className="truncate pr-px text-right capitalize">
											{mode.split(" (")[0]}
										</Text>
									</Box>
								</Box>
								<Space size={1} />

								<Text className="print:text-sm">{summary}</Text>
								<Space size={1} />

								{isNotEmptyArray(achievements) ? (
									<>
										<List
											variant={List.variant.SIMPLE}
											className="mx-1"
										>
											{achievements.map((item, index) => {
												return (
													<List.Item key={generateSlug(`full-${id}-achievements-${index}`)}>
														{item}
													</List.Item>
												);
											})}
										</List>
										<Space size={1} />
									</>
								) : null}

								<Text className="font-bold">{texts.SKILLS}:</Text>
								<Box className="flex flex-wrap items-center gap-x-1 gap-y-1 p-1">
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
							<List.Item key={generateSlug(`short-skills-label-${item.category}`)}>
								<Text>{texts[`SKILLS_L${index + 1}` as keyof typeof texts]}:</Text>
								<Box className="mt-1 mb-3 flex flex-wrap items-center gap-x-1 gap-y-1">
									{item.items.map((item) => {
										return <Skill key={`short-skills-tech-stack-${item}`}>{item}</Skill>;
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
								key={generateSlug(`languages-short-${item.language}`)}
							>{`${item.language} (${item.fluency})`}</List.Item>
						);
					})}
				</List>
			</ResumeBox>
		</>
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
		"Software Developer based in Colombia with over 8 years of experience designing, developing, and maintaining web applications. My primary focus is on front-end development, building user interfaces with JavaScript, TypeScript, and React. I also have experience working across the full stack, including back-end development, and have developed mobile applications using cross-platform frameworks such as React Native. Most of my experience comes from working in startup environments.",
	is_seo_enabled: true,
	pathname: "/resume",
};
