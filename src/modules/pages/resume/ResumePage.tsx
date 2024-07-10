import * as React from "react";
import cn from "classnames";

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
				"https://drive.google.com/file/d/0Z1-PEvIrilz9SbXef2KLY88ILSFbj7N/view?usp=sharing",
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
					<Block className="tw-mx-auto tw-max-w-screen-md tw-overflow-hidden">
						<Block className="tw-mb-3 tw-flex tw-items-end tw-justify-start tw-gap-2 tw-text-sm tw-font-bold print:tw-hidden">
							<Button
								variant={Button.variant.STYLED}
								className="tw-inline-block tw-text-left"
								onClick={handleToggleViewModeClick}
							>
								<InlineText>Version: </InlineText>
								<Icon
									icon={
										viewMode === "SHORT"
											? Icon.icon.ARROWS_POINTING_IN
											: Icon.icon.ARROWS_POINTING_OUT
									}
									wrapperClassName="tw-relative tw--top-px"
								/>
							</Button>

							<Button
								variant={Button.variant.STYLED}
								className="tw-inline-block tw-w-24 tw-text-left"
								onClick={handleToggleLangClick}
							>
								<InlineText>Lang: </InlineText>
								<InlineText>{lang.toUpperCase()}</InlineText>
							</Button>

							<Button
								variant={Button.variant.STYLED}
								className="tw-inline-block tw-text-left"
								onClick={handleDownloadAsPDFClick}
							>
								<Icon
									icon={Icon.icon.ARROW_DOWN_TRAY}
									iconClassName="tw-relative tw--top-px"
								/>
								<InlineText className="tw-ml-0.5">PDF</InlineText>
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
				className="tw-bg-gray-300 tw-p-4"
			>
				<Title
					is="h1"
					size={Title.size.LG}
				>
					{data.shortName}
				</Title>
				<Space size={1} />

				<Text>{data.headline}</Text>
				<Space size={1} />

				<Text className="tw-text-sm">
					<Link
						variant={Link.variant.SIMPLE}
						href={`mailto:${data.contactInfo.email}`}
						className="tw-font-bold tw-underline"
						isExternalLink
					>
						{data.contactInfo.email}
					</Link>{" "}
					|{" "}
					<Link
						variant={Link.variant.SIMPLE}
						href={data.contactInfo.websites[1].value}
						className="tw-font-bold tw-underline"
						isExternalLink
					>
						{data.contactInfo.websites[1].value.replace("https://", "")}
					</Link>{" "}
					|{" "}
					<InlineText>
						{data.location.from.city.split(",")[1]}, {data.location.from.country}
					</InlineText>
				</Text>
			</Block>

			<Block className="tw-p-4">
				<ResumeBlock
					title={texts.EXPERIENCE}
					variant="SIMPLE"
				>
					{data.experience.map((item) => {
						return (
							<Block
								key={item.id}
								className="tw-mb-6 last:tw-mb-0"
							>
								<Block className="tw-flex tw-items-center tw-justify-between">
									{v.isNotEmptyString(item.companyWebsite) ? (
										<Link
											variant={Link.variant.SIMPLE}
											className="tw-font-bold tw-text-black tw-underline"
											href={item.companyWebsite}
											onClick={AnalyticsService.trackClickEvent("RESUME|EXPERIENCE", {
												item: item.company,
											})}
											isExternalLink
										>
											{item.company}
										</Link>
									) : (
										<Text className="tw-font-bold tw-text-black">{item.company}</Text>
									)}
									<Block className="tw-text-xs tw-italic">
										{item.startDate} - {item.endDate}
									</Block>
								</Block>

								<Block className="tw--mt-0.5 tw-text-sm tw-italic">{item.role}</Block>

								<Block>
									{item.description.split("› ").map((line) => {
										if (!line) {
											return null;
										}

										const [contentName, ...content] = line.split(":");

										if (contentName.startsWith("Pro")) {
											return null;
										}

										return (
											<Pre
												key={item.id}
												variant={Pre.variant.BREAK_WITH_BLANK_SPACES}
											>
												{contentName.toLowerCase().includes("stack") ? (
													<InlineText
														is="strong"
														className="tw-mr-1 tw-text-sm"
													>
														{contentName}:
													</InlineText>
												) : null}

												{contentName.toLowerCase().includes("stack")
													? content
															.join("")
															.split(",")
															.map((stackItem) => {
																return (
																	<InlineText
																		key={`${item.id}-${stackItem}`}
																		className="tw-mr-1 tw-mt-1 tw-inline-block tw-rounded-md tw-border tw-border-gray-200 tw-bg-gray-100 tw-px-1.5 tw-py-0.5 tw-font-mono tw-text-xs tw-text-gray-600"
																	>
																		{stackItem.trim()}
																	</InlineText>
																);
															})
													: content.join("").trim()}
											</Pre>
										);
									})}
								</Block>
							</Block>
						);
					})}
				</ResumeBlock>

				<ResumeBlock
					title={texts.EDUCATION}
					variant="SIMPLE"
				>
					{data.education.map((item) => {
						return (
							<Block
								key={item.id}
								className="tw-mb-6 last:tw-mb-0"
							>
								<Text className="tw--mb-0.5 tw-font-bold">{item.degree}</Text>
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
									<Text className="tw-text-xs tw-italic">
										<InlineText>{item.startDate}</InlineText> /{" "}
										<InlineText>{item.endDate}</InlineText>
									</Text>
								) : null}
							</Block>
						);
					})}
				</ResumeBlock>

				<ResumeBlock
					title={texts.OTHER}
					variant="SIMPLE"
				>
					<Block>
						<Text className="tw-font-bold">{texts.SKILLS}:</Text>
						<List
							variant={List.variant.SIMPLE}
							className="tw-ml-2"
						>
							{Object.entries(data.skills).map(([, value], index) => {
								return (
									<List.Item key={generateSlug(`skills-short-${value[0]}`)}>
										{texts[`SKILLS_L${index + 1}` as keyof typeof texts]}: {value.join(", ")}
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
							className="tw-ml-2"
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
			</Block>
		</Block>
	);
}

function FullMode({ data }: { data: T_ResumePageProps["data"][keyof T_ResumePageProps["data"]] }) {
	return (
		<Block className="print:tw-w-FULL tw-relative tw-bg-white tw-px-6 tw-py-16 tw-text-black print:tw-border-0 print:tw-p-0 md:tw-px-8">
			<PrintBlock
				className="print:tw-flex print:tw-items-center print:tw-justify-center"
				FULLPage
			>
				<Block
					is="header"
					className="tw-text-center"
				>
					<Title
						is="h1"
						size={Title.size.XL}
						variant={Title.variant.SIMPLE}
					>
						{data.fullName}
					</Title>
					<Space size={2} />

					<Text>{data.headline}</Text>
					<Space size={1} />

					<Block>
						<Text className="tw-text-sm tw-italic tw-text-gray-500">
							<InlineText is="strong">From: </InlineText>{" "}
							<InlineText>{data.location.from.city}</InlineText> <InlineText> / </InlineText>
							<InlineText>{data.location.from.country}</InlineText>
						</Text>
						<Text className="tw-text-sm tw-italic tw-text-gray-500">
							<InlineText is="strong">Living in: </InlineText>{" "}
							<InlineText>{data.location.from.city}</InlineText> <InlineText> / </InlineText>
							<InlineText>{data.location.from.country}</InlineText>
						</Text>
					</Block>

					<Space size={4} />

					<Block className="tw-flex tw-justify-center tw-gap-2 dr-text-color-surface-600">
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
								size={40}
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
								size={40}
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
											icon={Icon.icon.WEBSITE}
											size={40}
										/>
									) : (
										<Icon
											icon={Icon.icon.GITHUB}
											size={40}
											iconClassName="tw-p-1"
										/>
									)}
								</Link>
							);
						})}
					</Block>
				</Block>
			</PrintBlock>

			<PrintBlock FULLPage>
				<ResumeBlock title="Summary">
					<Pre
						variant={Pre.variant.BREAK_WITH_BLANK_LINES}
						className="dr-font-texts md:tw-text-justify"
					>
						{data.summary}
					</Pre>
				</ResumeBlock>
				<ResumeBlock title="Education">
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
											<Text className="tw-text-xs tw-italic">
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
			</PrintBlock>

			<PrintBlock>
				<ResumeBlock title="Experience">
					<ExperienceTimeline experience={data.experience} />
				</ResumeBlock>
			</PrintBlock>
		</Block>
	);
}

function PrintBlock({
	children,
	FULLPage = false,
	className,
}: {
	children: DR.React.Children;
	FULLPage?: boolean;
	className?: string;
}) {
	return (
		<Block className={cn("print:tw-py-8", FULLPage && "print:tw-h-screen", className)}>
			{children}
		</Block>
	);
}

type T_ResumeBlockProps = {
	title: string;
	children: DR.React.Children;
	variant?: "SIMPLE";
};

function ResumeBlock({ title, children, variant }: T_ResumeBlockProps) {
	if (variant === "SIMPLE") {
		return (
			<Block
				is="section"
				className="tw-mb-6 last:tw-mb-0"
			>
				<Title
					is="h2"
					variant={Title.variant.UNSTYLED}
					className="tw-w-FULL tw-mb-2 tw-border-b tw-border-dashed tw-border-black tw-text-left tw-text-lg tw-uppercase"
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
			className="tw-mt-16 tw-pt-16 print:tw-mb-16 print:tw-mt-0 print:tw-pt-0"
		>
			<Title
				is="h2"
				variant={Title.variant.SIMPLE}
				className="tw-w-FULL tw-mb-8 tw-border-b-4 tw-border-l-4 tw-border-double tw-border-black tw-py-2 tw-pl-4 tw-text-left tw-uppercase"
				size={Title.size.LG}
			>
				{title}
			</Title>
			{children}
		</Block>
	);
}

type T_ExperienceTimelineProps = {
	experience: T_Resume["experience"];
};

export function ExperienceTimeline({ experience }: T_ExperienceTimelineProps) {
	return (
		<Block className="tw-ml-2 tw-border-l-2 tw-border-black print:tw-border-0">
			{experience.map((item) => {
				return (
					<ExperienceTimelineItem
						key={item.id}
						item={item}
					/>
				);
			})}
		</Block>
	);
}

function ExperienceTimelineItem({
	item: { id, role, company, companyLogo, companyWebsite, startDate, endDate, description },
}: {
	item: T_Resume["experience"][number];
}) {
	return (
		<Block
			is="section"
			className="tw-relative tw-mb-8 tw-pl-10 last:tw-mb-0 print:odd:tw-mb-9 print:even:tw-mb-72"
		>
			<Block className="tw-absolute tw--left-2 tw-top-0 tw-overflow-hidden tw-border-2 tw-border-black tw-bg-white tw-wh-10">
				{v.isNotEmptyString(companyLogo) ? (
					<Image
						src={companyLogo}
						alt="Company logo"
						fill
					/>
				) : (
					<Block className="tw-wh-FULL" />
				)}
			</Block>

			<Block>
				<Title
					is="h3"
					variant={Title.variant.SIMPLE}
					size={Title.size.MD}
				>
					{role}
				</Title>

				{v.isNotEmptyString(companyWebsite) ? (
					<Link
						variant={Link.variant.SIMPLE}
						className="tw-text-base tw-text-black tw-underline"
						href={companyWebsite}
						onClick={AnalyticsService.trackClickEvent("RESUME|EXPERIENCE", {
							item: company,
						})}
						isExternalLink
					>
						{company}
					</Link>
				) : (
					<Text className="tw-text-base tw-text-black">{company}</Text>
				)}

				<Text className="tw-text-xs tw-italic tw-text-gray-400">
					<InlineText>{startDate}</InlineText> / <InlineText>{endDate || "present"}</InlineText>
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
														<InlineText
															key={`${id}-${item}`}
															className="tw-mr-1 tw-mt-1 tw-inline-block tw-rounded-md tw-border tw-border-gray-200 tw-bg-gray-100 tw-px-1.5 tw-py-0.5 tw-font-mono tw-text-sm tw-text-gray-600"
														>
															{item.trim()}
														</InlineText>
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
}
