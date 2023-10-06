import * as React from "react";
import cn from "classnames";

import { MainLayout, Page } from "~/components/layout";
import {
	Block,
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
import { generateSlug } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";
import type DR from "@diegofrayo/types";
import type { T_PageContent } from "~/data/loader";

// --- COMPONENT DEFINITION ---

export type T_ResumePageProps = {
	content: T_PageContent;
	data: T_Resume;
};

function ResumePage({ data, content }: T_ResumePageProps) {
	return (
		<Page
			config={{
				title: content.content.seo.title,
				description: content.content.seo.description,
				disableSEO: content.config.is_seo_enabled === false,
				pathname: content.config.pathname,
			}}
		>
			<MainLayout title={content.content.seo.title}>
				{/*
				<Block className="tw-text-right">
					<Link
						href="https://drive.google.com/file/d/1zOaXbESJ4mXasY0WybvfTD9G9qN2Ya7g/view?usp=sharing"
						className="tw-ml-3 tw-inline-block tw-rounded-t-md tw-border tw-border-gray-700 tw-bg-gray-700 tw-px-3 tw-py-1 tw-text-sm tw-font-bold tw-italic tw-text-white"
						isExternalLink
					>
						<Icon
							icon={Icon.icon.ARROW_DOWN_TRAY}
							wrapperClassName="tw-mr-1 tw-relative tw--top-0.5"
						/>
						<InlineText>Download as PDF</InlineText>
					</Link>
				</Block>
        */}

				<Block
					className="tw-relative tw-mx-auto tw-max-w-screen-md tw-overflow-hidden tw-border-12 tw-border-gray-700
        tw-bg-white tw-px-6 tw-py-16 tw-font-serif tw-text-black print:tw-w-full print:tw-border-0 print:tw-p-0 md:tw-px-8"
				>
					<PrintBlock
						className="print:tw-flex print:tw-items-center print:tw-justify-center"
						fullPage
					>
						<Block
							is="header"
							className="tw-text-center"
						>
							<Title
								is="h1"
								size={Title.size.XL}
								variant={Title.variant.DEFAULT}
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

							<Block className="tw-text-center dr-text-color-surface-600">
								<Link
									variant={Link.variant.SIMPLE}
									href={`mailto:${data.contactInfo.email}`}
									className="tw-mx-2"
									isExternalLink
								>
									<Icon
										icon={Icon.icon.GMAIL_MONO}
										size={32}
									/>
								</Link>
								<Link
									variant={Link.variant.SIMPLE}
									href={data.contactInfo.linkedin}
									className="tw-mx-2 tw-inline-block"
									isExternalLink
								>
									<Icon
										icon={Icon.icon.LINKEDIN_MONO}
										size={30}
									/>
								</Link>
								{data.contactInfo.websites.map((website) => {
									const isPersonalWebsite = website.name.toLowerCase().includes("website");

									return (
										<Link
											key={generateSlug(website.name)}
											variant={Link.variant.SIMPLE}
											href={website.value}
											className="tw-mx-2 tw-inline-block"
											isExternalLink
										>
											{isPersonalWebsite ? (
												<Icon
													icon={Icon.icon.LINK}
													size={26}
												/>
											) : (
												<Icon
													icon={Icon.icon.GITHUB_MONO}
													size={30}
												/>
											)}
										</Link>
									);
								})}
							</Block>
						</Block>
					</PrintBlock>

					<PrintBlock fullPage>
						<ResumeBlock title="Summary">
							<Pre
								variant={Pre.variant.BREAK_WITH_BLANK_LINES}
								className="tw-font-serif md:tw-text-justify"
							>
								{data.summary}
							</Pre>
						</ResumeBlock>
						<ResumeBlock title="Education">
							<Block>
								{data.education.map((item) => {
									return (
										<Block
											key={generateSlug(item.degree)}
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
													variant={Title.variant.DEFAULT}
													size={Title.size.MD}
												>
													{item.degree}
												</Title>
												<Link
													variant={Link.variant.SIMPLE}
													href={item.schoolWebsite}
													className="tw-underline"
													isExternalLink
												>
													{item.school}
												</Link>
												<Text className="tw-text-xs tw-italic tw-text-gray-400">
													<InlineText>{item.startDate}</InlineText> /{" "}
													<InlineText>{item.endDate}</InlineText>
												</Text>
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
			</MainLayout>
		</Page>
	);
}

export default ResumePage;

// --- TYPES ---

type T_Resume = {
	profilePhoto: string;
	fullName: string;
	headline: string;
	location: T_Location;
	contactInfo: T_ContactInfo;
	summary: string;
	education: T_Education[];
	experience: T_Experience[];
};

type T_Location = {
	from: { country: string; city: string };
	currently: { country: string; city: string };
};

type T_ContactInfo = {
	linkedin: string;
	websites: T_Website[];
	email: string;
};

type T_Website = {
	name: string;
	value: string;
};

type T_Education = {
	school: string;
	schoolWebsite: string;
	schoolLogo: string;
	degree: string;
	startDate: string;
	endDate: string;
};

type T_Experience = {
	id: string;
	role: string;
	company: string;
	companyLogo: string;
	companyWebsite: string;
	startDate: string;
	endDate: string;
	description: string;
};

// --- COMPONENTS ---

function PrintBlock({
	children,
	fullPage = false,
	className,
}: {
	children: DR.React.Children;
	fullPage?: boolean;
	className?: string;
}) {
	return (
		<Block className={cn("print:tw-py-8", fullPage && "print:tw-h-screen", className)}>
			{children}
		</Block>
	);
}

type T_ResumeBlockProps = {
	title: string;
	children: DR.React.Children;
};

function ResumeBlock({ title, children }: T_ResumeBlockProps) {
	return (
		<Block
			is="section"
			className="tw-mt-16 tw-pt-16 print:tw-mb-16 print:tw-mt-0 print:tw-pt-0"
		>
			<Title
				is="h2"
				variant={Title.variant.DEFAULT}
				className="tw-mb-8 tw-w-full tw-border-b-4 tw-border-l-4 tw-border-double tw-border-black tw-py-2 tw-pl-4 tw-text-left tw-uppercase"
				size={Title.size.LG}
			>
				{title}
			</Title>
			{children}
		</Block>
	);
}

type T_ExperienceTimelineProps = {
	experience: T_Experience[];
};

export function ExperienceTimeline({ experience }: T_ExperienceTimelineProps) {
	return (
		<Block className="tw-ml-2 tw-border-l-2 tw-border-dashed tw-border-black">
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
	item: { role, company, companyLogo, companyWebsite, startDate, endDate, description },
}: {
	item: T_Experience;
}) {
	return (
		<Block
			is="section"
			className="tw-relative tw-mb-8 tw-pl-10 last:tw-mb-0 print:tw-mb-20"
		>
			<Block className="tw-absolute tw--left-3 tw-top-0 tw-overflow-hidden tw-border-2 tw-border-black tw-bg-white tw-wh-10">
				{v.isNotEmptyString(companyLogo) ? (
					<Image
						src={companyLogo}
						alt="Company logo"
						fill
					/>
				) : (
					<Block className="tw-wh-full" />
				)}
			</Block>

			<Block>
				<Title
					is="h3"
					variant={Title.variant.DEFAULT}
					size={Title.size.MD}
				>
					{role}
				</Title>

				{v.isNotEmptyString(companyWebsite) ? (
					<Link
						variant={Link.variant.SIMPLE}
						className="tw-underline"
						href={companyWebsite}
						isExternalLink
					>
						{company}
					</Link>
				) : (
					<Text className="tw-text-black">{company}</Text>
				)}

				<Text className="tw-text-xs tw-italic tw-text-gray-400">
					<InlineText>{startDate}</InlineText> / <InlineText>{endDate || "present"}</InlineText>
				</Text>
				<Space size={2} />

				<List variant={List.variant.DEFAULT}>
					{description.split("› ").map((line, index) => {
						if (!line) return null;

						const [contentName, ...content] = line.split(":");

						return (
							<List.Item key={generateSlug(`${company}-description-item-${index}`)}>
								<Pre
									variant={Pre.variant.BREAK_WITH_BLANK_SPACES}
									className="tw-font-serif print:tw-text-sm"
								>
									<InlineText is="strong">{contentName}:</InlineText>
									{contentName === "Tech-stack" ? (
										<Block>
											{content
												.join("")
												.split(",")
												.map((item) => {
													return (
														<InlineText
															key={generateSlug(`${company}-description-tech-stack-${item}`)}
															className="tw-mr-1 tw-mt-1 tw-inline-block tw-rounded-md tw-border tw-border-dotted tw-border-gray-200 tw-bg-gray-100 tw-px-1.5 tw-py-0.5 tw-font-mono tw-text-sm tw-text-gray-600"
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
