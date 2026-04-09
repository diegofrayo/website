import { useEffect } from "react";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { flushSync } from "react-dom";

import { useBrowserStorage } from "@diegofrayo-pkg/browser-storage";
import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import type { Resume } from "@diegofrayo-pkg/types/resume";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";
import { isNotEmptyArray, isNotEmptyString } from "@diegofrayo-pkg/validator";

import { MainLayout, Page } from "~/components/layout";
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
} from "~/components/primitive";
import AnalyticsService from "~/features/analytics";
import { WithAuth } from "~/features/auth";

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
	const [viewMode, setViewMode] = useBrowserStorage<ViewMode>({
		key: "DR_RESUME_VIEW_MODE",
		value: "SHORT",
		readInitialValueFromStorage: true,
		saveDuringCreation: true,
	});
	const [lang, setLang] = useBrowserStorage<Lang>({
		key: "DR_RESUME_LANG",
		value: "EN",
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
				tag.innerHTML = viewMode === "SHORT" ? SHORT_MODE_STYLES : FULL_MODE_STYLES;
			}
		},
		[viewMode],
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
						<Box className="flex w-full flex-col justify-center gap-3 sm:flex-row print:hidden">
							<ActionButtons
								viewMode={viewMode}
								lang={lang}
								onViewModeChange={setViewMode}
								onLangChange={setLang}
							/>
							<WithAuth
								roles={["ADMIN"]}
								asChild
							>
								<DownloadActions
									viewMode={viewMode}
									lang={lang}
									onViewModeChange={setViewMode}
									onLangChange={setLang}
								/>
							</WithAuth>
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

				<ContactInfo
					contactInfo={data.contactInfo}
					variant="SHORT"
				/>
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

				<ContactInfo
					contactInfo={data.contactInfo}
					variant="FULL"
				/>
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

function ContactInfo({
	contactInfo,
	variant,
}: {
	contactInfo: Resume["contactInfo"];
	variant: "SHORT" | "FULL";
}) {
	const classes = {
		item: cn(
			"inline-flex shrink-0 items-center justify-center gap-1",
			"odd:sm:justify-end even:sm:justify-start",
		),
	};
	const isShortVariant = variant === "SHORT";

	return (
		<Box className="grid grid-cols-1 gap-x-3 gap-y-1 text-black sm:grid-cols-2">
			<Link
				variant={Link.variant.SMOOTH}
				href={`mailto:${contactInfo.email}`}
				className={classes.item}
				isExternalLink
			>
				{isShortVariant ? (
					<Icon
						icon={IconCatalog.MAILS}
						size={16}
					/>
				) : (
					<Icon
						icon={IconCatalog.GMAIL}
						size={22}
					/>
				)}
				<InlineText className="text-sm font-semibold">{contactInfo.email}</InlineText>
			</Link>
			<Link
				variant={Link.variant.SMOOTH}
				href={contactInfo.website}
				className={classes.item}
				isExternalLink
			>
				{isShortVariant ? (
					<Icon
						icon={IconCatalog.GLOBE}
						size={16}
					/>
				) : (
					<Icon
						icon={IconCatalog.WEBSITE}
						size={16}
					/>
				)}
				<InlineText className="text-sm font-semibold">
					{contactInfo.website.replace("https://", "")}
				</InlineText>
			</Link>
			<Link
				variant={Link.variant.SMOOTH}
				href={contactInfo.profiles[0].url}
				className={classes.item}
				isExternalLink
			>
				{isShortVariant ? (
					<Icon
						icon={IconCatalog.LINKEDIN_MONO}
						className="size-4"
						strokeWidth={2}
					/>
				) : (
					<Icon
						icon={IconCatalog.LINKEDIN}
						wrapperClassName="size-4"
					/>
				)}
				<InlineText className="text-sm font-semibold">
					{contactInfo.profiles[0].url.replace("https://www.", "")}
				</InlineText>
			</Link>
			<Link
				variant={Link.variant.SMOOTH}
				href={contactInfo.profiles[1].url}
				className={classes.item}
				isExternalLink
			>
				{isShortVariant ? (
					<Icon
						icon={IconCatalog.GITHUB_MONO}
						className="size-4"
					/>
				) : (
					<Icon
						icon={IconCatalog.GITHUB}
						wrapperClassName="size-4"
					/>
				)}
				<InlineText className="text-sm font-semibold">
					{contactInfo.profiles[1].url.replace("https://www.", "")}
				</InlineText>
			</Link>
		</Box>
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

type ActionButtonsProps = {
	viewMode: ViewMode;
	lang: Lang;
	onViewModeChange: (viewMode: ViewMode) => void;
	onLangChange: (lang: Lang) => void;
};

function ActionButtons({ viewMode, lang, onViewModeChange, onLangChange }: ActionButtonsProps) {
	// --- STYLES ---
	const classes = {
		icon: "px-2 text-slate-400",
		separator: "mx-1.5 h-5 w-px border-slate-200",
		toggle:
			"cursor-pointer rounded-full px-3 py-1 text-slate-600 transition-colors data-pressed:bg-slate-900 data-pressed:text-white",
		downloadPDF: "flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-white h-full",
	};

	// --- HANDLERS ---
	function handleViewModeChange(newValue: string[]) {
		if (newValue.length > 0) {
			const newMode = newValue[0] as ViewMode;
			onViewModeChange(newMode);
			AnalyticsService.trackEvent("RESUME|SET_VIEW_MODE", { view_mode: newMode });
		}
	}

	function handleLangChange(newValue: string[]) {
		if (newValue.length === 0) return;

		const newLang = newValue[0] as Lang;
		onLangChange(newLang);
		AnalyticsService.trackEvent("RESUME|SET_LANG", { lang: newLang });
	}

	return (
		<Box className="flex justify-center">
			<Box className="flex items-center rounded-full border border-slate-100 bg-white px-1.5 py-1 text-sm font-medium shadow-sm">
				<Icon
					icon={IconCatalog.FILE_TEXT}
					size={16}
					wrapperClassName={classes.icon}
				/>
				<ToggleGroup
					value={[viewMode]}
					onValueChange={handleViewModeChange}
					className="flex"
				>
					<Toggle
						value="SHORT"
						aria-label="Short view"
						className={classes.toggle}
					>
						Short
					</Toggle>
					<Toggle
						value="FULL"
						aria-label="Full view"
						className={classes.toggle}
					>
						Full
					</Toggle>
				</ToggleGroup>

				<Space
					variant={Space.variant.SIMPLE}
					orientation="v"
					className={classes.separator}
				/>

				<Icon
					icon={IconCatalog.LANGUAGES}
					size={16}
					wrapperClassName={classes.icon}
				/>
				<ToggleGroup
					value={[lang]}
					onValueChange={handleLangChange}
					className="flex"
				>
					<Toggle
						value="EN"
						aria-label="English"
						className={classes.toggle}
					>
						EN
					</Toggle>
					<Toggle
						value="ES"
						aria-label="Spanish"
						className={classes.toggle}
					>
						ES
					</Toggle>
				</ToggleGroup>
			</Box>
		</Box>
	);
}

type DownloadActionsProps = {
	viewMode: ViewMode;
	lang: Lang;
	onViewModeChange: (viewMode: ViewMode) => void;
	onLangChange: (lang: Lang) => void;
};

function DownloadActions({ viewMode, lang, onViewModeChange, onLangChange }: DownloadActionsProps) {
	// --- STATE ---
	const [downloadMode, setDownloadMode] = useBrowserStorage<DownloadMode>({
		key: "RESUME_DOWNLOAD_MODE",
		value: "CURRENT",
		readInitialValueFromStorage: true,
		saveDuringCreation: true,
	});

	// --- STYLES ---
	const classes = {
		radioGroup: "flex gap-5 py-1",
		radioItem: cn("flex cursor-pointer items-center gap-1"),
		radio: cn(
			"m-0 box-border flex size-4 items-center justify-center rounded-full border border-black bg-black p-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 data-unchecked:bg-black",
		),
		indicator: cn(
			"&:data-unchecked:hiddenw flex items-center justify-center before:size-1.5 before:rounded-full before:bg-slate-300 before:content-['']",
		),
		downloadButton:
			"flex h-full cursor-pointer items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-white ml-2",
		separator: "mx-1.5 h-5 w-px border-slate-200",
	};

	// --- HANDLERS ---
	function handleDownloadClick() {
		if (downloadMode === "CURRENT") {
			window.print();
		} else {
			downloadAll();
		}
	}

	// --- UTILS ---
	function downloadAll() {
		const originalViewMode = viewMode;
		const originalLang = lang;
		const originalTitle = document.title;
		const variants: Array<{ lang: Lang; viewMode: ViewMode }> = [
			{ lang: "EN", viewMode: "SHORT" },
			{ lang: "ES", viewMode: "SHORT" },
			{ lang: "EN", viewMode: "FULL" },
			{ lang: "ES", viewMode: "FULL" },
		];

		let index = 0;

		const triggerPrint = (lang: Lang, viewMode: ViewMode) => {
			const isDefaultResume = lang === "EN" && viewMode === "SHORT";
			document.title = isDefaultResume ? "2026" : `2026 - ${lang} - ${viewMode}`.toUpperCase();
			window.print();
		};

		const printNext = () => {
			if (index >= variants.length) {
				document.title = originalTitle;
				onViewModeChange(originalViewMode);
				onLangChange(originalLang);
				return;
			}

			const variant = variants[index++];

			flushSync(() => {
				onViewModeChange(variant.viewMode);
				onLangChange(variant.lang);
			});

			setTimeout(() => {
				window.addEventListener("afterprint", printNext, { once: true });
				triggerPrint(variant.lang, variant.viewMode);
			}, 1000);
		};

		printNext();
	}

	return (
		<Box className="flex justify-center">
			<Box className="flex items-center gap-3 rounded-full border border-slate-100 bg-white px-1.5 py-1 text-sm font-medium shadow-sm">
				<Icon
					icon={IconCatalog.DOWNLOAD}
					size={16}
					wrapperClassName="px-2 text-slate-400"
				/>

				<RadioGroup
					value={downloadMode}
					onValueChange={(val) => setDownloadMode(val as DownloadMode)}
					className={classes.radioGroup}
				>
					<label className={classes.radioItem}>
						<Radio.Root
							value="CURRENT"
							aria-label="Download current variant"
							className={classes.radio}
						>
							<Radio.Indicator className={classes.indicator} />
						</Radio.Root>
						<InlineText>Current</InlineText>
					</label>

					<label className={classes.radioItem}>
						<Radio.Root
							value="ALL"
							aria-label="Download all variants"
							className={classes.radio}
						>
							<Radio.Indicator className={classes.indicator} />
						</Radio.Root>
						<InlineText>All</InlineText>
					</label>
				</RadioGroup>

				<Button
					variant={Button.variant.SMOOTH}
					className={classes.downloadButton}
					onClick={handleDownloadClick}
				>
					<InlineText>Download</InlineText>
				</Button>
			</Box>
		</Box>
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

// --- TYPES ---

type ViewMode = "FULL" | "SHORT";
type Lang = "EN" | "ES";
type DownloadMode = "CURRENT" | "ALL";

// --- CONSTANTS ---

const metadata = {
	title: "Resume",
	description:
		"I'm Diego, a Systems and Computing Engineer from Universidad del Quindío, Colombia, with 8 years of experience developing web applications. I specialize in front-end development with JavaScript/TypeScript and React/Next.js, and also have experience working with Node.js, ORMs, and SQL/NoSQL databases. I’ve worked with startups, digital agencies, and as a freelancer. I have a B2 level of English. I'm interested in remote Front-end Developer roles to continue strengthening my experience in this area while further adopting AI in my workflow to improve productivity and maintain a high standard of work.",
	is_seo_enabled: true,
	pathname: "/resume",
};
