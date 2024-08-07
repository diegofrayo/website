import * as React from "react";

import { MainLayout, Page } from "~/components/layout";
import {
	Block,
	Button,
	Icon,
	Image,
	InlineText,
	Link,
	List,
	Pre,
	Space,
	Text,
	Title,
} from "~/components/primitive";
import WEBSITE_METADATA from "~/data/metadata.json";
import AnalyticsService from "~/modules/analytics";
import type { T_PageContent } from "~/server/data-loader";
import type DR from "@diegofrayo/types";
import type { T_Resume } from "@diegofrayo/types/resume";
import { generateSlug } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";

import { IntlContext, IntlProviderValue, useIntl } from "./context";

// --- COMPONENT DEFINITION ---

export type T_ResumePageProps = {
	cmsContent: T_PageContent;
	data: { en: T_Resume; es: T_Resume };
};

function ResumePage({ data, cmsContent }: T_ResumePageProps) {
	// --- STATES & REFS ---
	const [viewMode, setViewMode] = React.useState<"FULL" | "SHORT">("SHORT");
	const [lang, setLang] = React.useState<"ES" | "EN">("EN");

	// --- VARS ---
	const currentData = data[lang.toLowerCase() as Lowercase<typeof lang>];

	// --- EFFECTS ---
	React.useEffect(
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

	function handleDownloadAsPDFClick() {
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

		AnalyticsService.trackEvent("RESUME|DOWNLOAD_AS_PDF", { version: viewMode, lang });
		window.open(LINKS[`${lang}-${viewMode}`], "_blank");
	}

	return (
		<Page
			config={{
				title: cmsContent.content.seo.title,
				description: cmsContent.content.seo.description,
				disableSEO: cmsContent.config.is_seo_enabled === false,
				pathname: cmsContent.config.pathname,
			}}
		>
			<MainLayout title={cmsContent.content.seo.title}>
				<IntlContext.Provider value={IntlProviderValue[lang]}>
					<style id="print-styles" />
					<Block className="tw-mx-auto tw-max-w-screen-md">
						<Block className="tw-mb-4 tw-flex tw-justify-center tw-gap-2 tw-text-sm tw-font-bold print:tw-hidden">
							<Button
								variant={Button.variant.STYLED}
								className="tw-inline-block tw-w-28"
								onClick={handleToggleViewModeClick}
							>
								<InlineText>Version: </InlineText>
								<Icon
									icon={
										viewMode === "SHORT"
											? Icon.icon.ARROWS_POINTING_IN
											: Icon.icon.ARROWS_POINTING_OUT
									}
									size={viewMode === "SHORT" ? 12 : 16}
									wrapperClassName="tw-relative tw--top-px"
								/>
							</Button>

							<Button
								variant={Button.variant.STYLED}
								className="tw-inline-block tw-w-24"
								onClick={handleToggleLangClick}
							>
								<InlineText>Lang: </InlineText>
								<InlineText>{lang}</InlineText>
							</Button>

							<Button
								variant={Button.variant.STYLED}
								className="tw-inline-block"
								onClick={handleDownloadAsPDFClick}
							>
								<Icon
									icon={Icon.icon.ARROW_DOWN_TRAY}
									iconClassName="tw-relative tw--top-px"
								/>
								<InlineText> PDF</InlineText>
							</Button>
						</Block>

						{viewMode === "FULL" ? (
							<FullMode data={currentData} />
						) : (
							<ShortMode data={currentData} />
						)}
					</Block>
				</IntlContext.Provider>
			</MainLayout>
		</Page>
	);
}

export default ResumePage;

// --- COMPONENTS ---

function ShortMode({ data }: { data: T_ResumePageProps["data"][keyof T_ResumePageProps["data"]] }) {
	// --- HOOKS ---
	const texts = useIntl();

	return (
		<Block className="tw-bg-white tw-text-base tw-text-black">
			<Block
				is="header"
				className="tw-border-b tw-border-gray-200 tw-bg-gray-100 tw-p-4"
			>
				<Title
					is="h1"
					size={Title.size.LG}
				>
					{data.shortName}
				</Title>

				<Text>{data.headline}</Text>
				<Space size={1.5} />

				<Text className="tw-flex tw-flex-col tw-items-end tw-text-sm md:tw-flex-row md:tw-justify-end">
					<Link
						variant={Link.variant.SIMPLE}
						href={`mailto:${data.contactInfo.email}`}
						className="tw-font-bold tw-underline"
						isExternalLink
					>
						{data.contactInfo.email}
					</Link>
					<InlineText className="tw-mx-1 tw-hidden md:tw-inline-block">|</InlineText>
					<Link
						variant={Link.variant.SIMPLE}
						href={data.contactInfo.websites[1].value}
						className="tw-font-bold tw-underline"
						isExternalLink
					>
						{data.contactInfo.websites[1].value.replace("https://", "")}
					</Link>
					<InlineText className="tw-mx-1 tw-hidden md:tw-inline-block">|</InlineText>
					<Link
						variant={Link.variant.SIMPLE}
						href={data.contactInfo.websites[0].value}
						className="tw-font-bold tw-underline"
						isExternalLink
					>
						{data.contactInfo.websites[0].value.replace("https://", "")}
					</Link>
					<InlineText className="tw-mx-1 tw-hidden md:tw-inline-block">|</InlineText>
					<Link
						variant={Link.variant.SIMPLE}
						href={WEBSITE_METADATA.social.linkedin}
						className="tw-font-bold tw-underline"
						isExternalLink
					>
						{WEBSITE_METADATA.social.linkedin.replace("https://", "")}
					</Link>
				</Text>
				<Text className="tw-text-right tw-text-sm">
					{data.location.from.city.split(",")[1]}, {data.location.from.country}
				</Text>
			</Block>

			<Block className="tw-p-4">
				<ResumeBlock
					variant="SHORT"
					title={texts.EXPERIENCE}
				>
					{data.experience.map((item) => {
						return (
							<Block
								key={item.id}
								className="tw-mb-6 tw-break-inside-avoid last:tw-mb-0"
							>
								<Block className="tw-flex tw-items-center tw-justify-between tw-gap-4">
									{v.isNotEmptyString(item.companyWebsite) ? (
										<Link
											variant={Link.variant.SIMPLE}
											href={item.companyWebsite}
											className="tw-truncate tw-font-bold tw-text-black tw-underline"
											onClick={AnalyticsService.trackClickEvent("RESUME|EXPERIENCE", {
												item: item.company,
											})}
											isExternalLink
										>
											{item.company}
										</Link>
									) : (
										<Text className="tw-truncate tw-font-bold tw-text-black">{item.company}</Text>
									)}
									<Block className="tw-flex-shrink-0 tw-text-xs tw-lowercase tw-italic">
										{item.startDate} - {item.endDate}
									</Block>
								</Block>

								<Block className="tw--mt-0.5 tw-text-sm tw-italic">{item.role}</Block>

								<Block>
									{item.description.split("› ").map((line) => {
										const [contentName, ...rest] = line.split(":");
										const isTechStackContent = contentName.toLowerCase().includes("stack");
										const content = rest.join("");

										if (contentName.startsWith("Pro") || !contentName) {
											return null;
										}

										if (isTechStackContent) {
											return (
												<Text
													key={generateSlug(`${item.id}-${contentName}`)}
													className="tw-my-1"
												>
													<InlineText
														is="strong"
														className="tw-mr-1 tw-text-sm"
													>
														{contentName}:
													</InlineText>

													{content.split(",").map((techStackItem) => {
														return (
															<TechStackLabel key={`${item.id}-${techStackItem}`}>
																{techStackItem}
															</TechStackLabel>
														);
													})}
												</Text>
											);
										}

										if (content.includes("\n")) {
											return (
												<Pre
													key={generateSlug(`${item.id}-${contentName}`)}
													variant={Pre.variant.BREAK_WITH_BLANK_SPACES}
													className="tw-text-base dr-font-texts print:tw-text-sm"
												>
													{content.split("\n")[0].trim()}
												</Pre>
											);
										}

										return <Text key={generateSlug(`${item.id}-${contentName}`)}>{content}</Text>;
									})}
								</Block>
							</Block>
						);
					})}
				</ResumeBlock>
				<ResumeBlock
					variant="SHORT"
					title={texts.EDUCATION}
				>
					{data.education.map((item) => {
						return (
							<Block
								key={item.id}
								className="tw-mb-6 last:tw-mb-0"
							>
								<Text className="tw--mb-1 tw-font-bold">{item.degree}</Text>
								<Link
									variant={Link.variant.SIMPLE}
									href={item.schoolWebsite}
									className="tw-text-sm tw-underline"
									onClick={AnalyticsService.trackClickEvent("RESUME|EDUCATION", {
										item: item.school,
									})}
									isExternalLink
								>
									{item.school}
								</Link>
								{item.startDate ? (
									<Text className="tw-text-xs tw-lowercase tw-italic">
										<InlineText>{item.startDate}</InlineText> /{" "}
										<InlineText>{item.endDate}</InlineText>
									</Text>
								) : null}
							</Block>
						);
					})}
				</ResumeBlock>

				<OtherSection
					data={data}
					variant="SHORT"
				/>
			</Block>
		</Block>
	);
}

function FullMode({ data }: { data: T_ResumePageProps["data"][keyof T_ResumePageProps["data"]] }) {
	// --- HOOKS ---
	const texts = useIntl();

	return (
		<Block className="tw-relative tw-bg-white tw-px-6 tw-py-16 tw-text-black print:tw-py-0 md:tw-px-8">
			<Block
				is="header"
				className="tw-text-center"
			>
				<Title
					is="h1"
					variant={Title.variant.SIMPLE}
					size={Title.size.XL}
				>
					{data.fullName}
				</Title>
				<Space size={2} />

				<Text>{data.headline}</Text>
				<Space size={1} />

				<Text className="tw-text-sm tw-italic">
					<InlineText>{data.location.from.city}</InlineText> <InlineText> / </InlineText>
					<InlineText>{data.location.from.country}</InlineText>
				</Text>
				<Space size={2} />

				<Block className="tw-flex tw-items-center tw-justify-center tw-gap-2">
					<Link
						variant={Link.variant.SIMPLE}
						href={`mailto:${data.contactInfo.email}`}
						className="tw-inline-block"
						onClick={AnalyticsService.trackClickEvent("RESUME|SOCIAL_NETWORK", {
							item: "email",
						})}
						isExternalLink
					>
						<Icon
							icon={Icon.icon.GMAIL}
							size={36}
							iconClassName="tw-p-1"
						/>
					</Link>
					<Link
						variant={Link.variant.SIMPLE}
						href={data.contactInfo.linkedin}
						className="tw-inline-block"
						onClick={AnalyticsService.trackClickEvent("RESUME|SOCIAL_NETWORK", {
							item: "linkedin",
						})}
						isExternalLink
					>
						<Icon
							icon={Icon.icon.LINKEDIN}
							size={36}
							iconClassName="tw-p-1"
						/>
					</Link>
					{data.contactInfo.websites.map((website) => {
						const isPersonalWebsite = website.name.toLowerCase().includes("web");

						return (
							<Link
								key={generateSlug(website.name)}
								variant={Link.variant.SIMPLE}
								href={website.value}
								className="tw-inline-block"
								onClick={AnalyticsService.trackClickEvent("RESUME|SOCIAL_NETWORK", {
									item: isPersonalWebsite ? "website" : "github",
								})}
								isExternalLink
							>
								{isPersonalWebsite ? (
									<Icon
										icon={Icon.icon.LINK}
										size={28}
										color="tw-text-black"
									/>
								) : (
									<Icon
										icon={Icon.icon.GITHUB}
										size={36}
										iconClassName="tw-p-1"
									/>
								)}
							</Link>
						);
					})}
				</Block>
			</Block>

			<ResumeBlock
				variant="FULL"
				title={texts.SUMMARY}
			>
				<Pre
					variant={Pre.variant.BREAK_WITH_BLANK_LINES}
					className="dr-font-texts md:tw-text-justify"
				>
					{data.summary}
				</Pre>
			</ResumeBlock>

			<ResumeBlock
				variant="FULL"
				title={texts.EDUCATION}
			>
				<Block>
					{data.education.map((item) => {
						return (
							<Block
								key={item.id}
								className="tw-mb-4 tw-flex tw-items-start last:tw-mb-0"
							>
								<Image
									src={item.schoolLogo}
									alt={`${item.school} logo`}
									className="tw-relative tw-top-1 tw-mr-2 tw-flex-shrink-0"
									width={48}
									height={48}
								/>
								<Block>
									<Title
										is="h3"
										variant={Title.variant.SIMPLE}
										size={Title.size.MD}
									>
										{item.degree}
									</Title>
									<Link
										variant={Link.variant.SIMPLE}
										href={item.schoolWebsite}
										className="tw-text-base tw-underline"
										onClick={AnalyticsService.trackClickEvent("RESUME|EDUCATION", {
											item: item.school,
										})}
										isExternalLink
									>
										{item.school}
									</Link>
									{item.startDate ? (
										<Text className="tw-text-xs tw-lowercase tw-italic">
											<InlineText>{item.startDate}</InlineText> /{" "}
											<InlineText>{item.endDate}</InlineText>
										</Text>
									) : null}
								</Block>
							</Block>
						);
					})}
				</Block>
			</ResumeBlock>

			<ResumeBlock
				variant="FULL"
				title={texts.EXPERIENCE}
			>
				<ExperienceTimeline experience={data.experience} />
			</ResumeBlock>

			<OtherSection
				data={data}
				variant="FULL"
			/>
		</Block>
	);
}

type T_ResumeBlockProps = {
	title: string;
	children: DR.React.Children;
	variant: "SHORT" | "FULL";
};

function ResumeBlock({ title, children, variant }: T_ResumeBlockProps) {
	if (variant === "SHORT") {
		return (
			<Block
				is="section"
				className="tw-mb-6 last:tw-mb-0"
			>
				<Title
					is="h2"
					variant={Title.variant.UNSTYLED}
					className="tw-mb-2 tw-border-b tw-border-dashed tw-border-black tw-text-left tw-text-lg tw-uppercase"
				>
					{title}
				</Title>
				{children}
			</Block>
		);
	}

	return (
		<Block
			is="section"
			className="tw-mt-12"
		>
			<Title
				is="h2"
				variant={Title.variant.SIMPLE}
				className="tw-mb-4 tw-border-4 tw-border-double tw-border-black tw-px-4 tw-py-2 tw-text-left tw-uppercase"
				size={Title.size.LG}
			>
				{title}
			</Title>
			<Block className="tw-px-2">{children}</Block>
		</Block>
	);
}

type T_ExperienceTimelineProps = {
	experience: T_Resume["experience"];
};

function TechStackLabel({ children }: { children: string }) {
	return (
		<InlineText className="tw-my-0.5 tw-mr-1 tw-inline-block tw-rounded-md tw-border tw-border-gray-200 tw-bg-gray-100 tw-px-1.5 tw-py-0.5 tw-font-mono tw-text-xs tw-text-gray-600">
			{children.trim()}
		</InlineText>
	);
}

function OtherSection({
	data,
	variant,
}: {
	data: T_ResumePageProps["data"][keyof T_ResumePageProps["data"]];
	variant: "SHORT" | "FULL";
}) {
	// --- HOOKS ---
	const texts = useIntl();

	return (
		<ResumeBlock
			variant={variant}
			title={texts.OTHER}
		>
			<Block>
				<Text className="tw-font-bold">{texts.SKILLS}:</Text>
				<List
					variant={List.variant.SIMPLE}
					className="tw-ml-1"
				>
					{Object.entries(data.skills).map(([, value], index) => {
						return (
							<List.Item key={generateSlug(`short-skills-label-${value[0]}`)}>
								<InlineText className="tw-mr-1">
									{texts[`SKILLS_L${index + 1}` as keyof typeof texts]}:
								</InlineText>
								{value.map((item) => {
									return (
										<TechStackLabel key={`short-skills-tech-stack-${item}`}>{item}</TechStackLabel>
									);
								})}
							</List.Item>
						);
					})}
				</List>
			</Block>
			<Space size={2} />

			<Block>
				<Text className="tw-font-bold">{texts.LANGUAGES}:</Text>
				<List
					variant={List.variant.SIMPLE}
					className="tw-ml-1"
				>
					{data.languages.map((item) => {
						return (
							<List.Item
								key={generateSlug(`languages-short-${item.language}`)}
							>{`${item.language} (${item.fluency})`}</List.Item>
						);
					})}
				</List>
			</Block>
		</ResumeBlock>
	);
}

function ExperienceTimeline({ experience }: T_ExperienceTimelineProps) {
	// --- HOOKS ---
	const texts = useIntl();

	return (
		<Block className="tw-ml-2 tw-border-l-2 tw-border-dashed tw-border-black print:tw-border-0">
			{experience.map(
				({ id, role, company, companyLogo, companyWebsite, startDate, endDate, description }) => {
					return (
						<Block
							key={id}
							is="section"
							className="tw-relative tw-mb-6 tw-pl-10 last:tw-mb-0"
						>
							<Block className="tw-absolute tw--left-2 tw-top-0 tw-overflow-hidden tw-border-2 tw-border-black tw-bg-white tw-wh-10 print:tw-border-0">
								<Image
									src={companyLogo}
									alt="Company logo"
									fill
								/>
							</Block>

							<Block>
								<Title
									is="h3"
									variant={Title.variant.SIMPLE}
									size={Title.size.MD}
									className="tw-text-black"
								>
									{v.isNotEmptyString(companyWebsite) ? (
										<Link
											variant={Link.variant.SIMPLE}
											className="tw-text-black tw-underline"
											href={companyWebsite}
											onClick={AnalyticsService.trackClickEvent("RESUME|EXPERIENCE", {
												item: company,
											})}
											isExternalLink
										>
											{company}
										</Link>
									) : (
										company
									)}
								</Title>

								<Text>{role}</Text>

								<Text className="tw-text-xs tw-lowercase tw-italic">
									<InlineText>{startDate}</InlineText> /{" "}
									<InlineText>{endDate || texts.PRESENT}</InlineText>
								</Text>
								<Space size={1} />

								<List variant={List.variant.SIMPLE}>
									{description.split("› ").map((line) => {
										if (!line) {
											return null;
										}

										const [contentName, ...content] = line.split(":");

										return (
											<List.Item key={generateSlug(`${id}-${contentName}`)}>
												<Pre
													variant={Pre.variant.BREAK_WITH_BLANK_SPACES}
													className="tw-text-base dr-font-texts print:tw-text-sm"
												>
													<InlineText is="strong">{contentName}:</InlineText>
													{contentName.toLowerCase().includes("stack") ? (
														<Block>
															{content
																.join("")
																.split(",")
																.map((item) => {
																	return (
																		<TechStackLabel key={`${id}-${item}`}>{item}</TechStackLabel>
																	);
																})}
														</Block>
													) : (
														content.join(":")
													)}
												</Pre>
											</List.Item>
										);
									})}
								</List>
							</Block>
						</Block>
					);
				},
			)}
		</Block>
	);
}

// --- STYLES ---

const SHORT_MODE_STYLES = `
  @media print {
    @page {
      margin: 0cm;
    }

    /* Second page */
    @page :left {
      margin-top: 0.5cm;
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
