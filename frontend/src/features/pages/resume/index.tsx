import * as React from "react";
import classNames from "classnames";

import { Page } from "~/components/layout";
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
import { GoBack } from "~/components/shared";
import { useTranslation } from "~/features/i18n";
import { ROUTES } from "~/features/routing";
import { generateSlug } from "~/utils/strings";
import { isNotEmptyString } from "~/utils/validations";
import type { T_ReactChildren, T_ReactElement } from "~/types";

export default function ResumePage({ resume }: { resume: T_Resume }): T_ReactElement {
	// hooks
	const { t } = useTranslation();

	return (
		<Page
			config={{
				title: t("seo:title"),
				description: t("seo:description"),
				pathname: ROUTES.RESUME,
				disableSEO: Boolean(t("page:config:is_seo_disabled")),
			}}
		>
			<Block
				is="main"
				className="tw-relative tw-mx-auto tw-px-8 tw-py-16 dfr-max-w-layout dfr-shadow print:tw-w-full print:tw-border-0 print:tw-p-0 print:tw-shadow-none"
			>
				<GoBack className="tw-absolute tw-top-0 print:tw-hidden" />
				<PrintBlock
					className="print:tw-flex print:tw-items-center print:tw-justify-center"
					fullPage
				>
					<Block
						is="header"
						className="tw-text-center"
					>
						<Title is="h1">{resume.fullName}</Title>
						<Space size={2} />

						<Text>{resume.headline}</Text>
						<Space size={1} />

						<Block>
							<Text className="tw-text-xs tw-italic dfr-text-color-secondary">
								<InlineText is="strong">From: </InlineText>{" "}
								<InlineText>{resume.location.from.city}</InlineText> <InlineText> / </InlineText>
								<InlineText>{resume.location.from.country}</InlineText>
							</Text>
							<Text className="tw-text-xs tw-italic dfr-text-color-secondary">
								<InlineText is="strong">Living in: </InlineText>{" "}
								<InlineText>{resume.location.from.city}</InlineText> <InlineText> / </InlineText>
								<InlineText>{resume.location.from.country}</InlineText>
							</Text>
						</Block>

						<Space size={4} />

						<Block className="tw-text-center">
							<Link
								variant={Link.variant.SIMPLE}
								href={`mailto:${resume.contactInfo.email}`}
								className="tw-mx-2 tw-inline-block"
								isExternalLink
							>
								<Icon
									icon={Icon.icon.GMAIL}
									size={32}
								/>
							</Link>
							<Link
								variant={Link.variant.SIMPLE}
								href={resume.contactInfo.linkedin}
								className="tw-mx-2 tw-inline-block"
								isExternalLink
							>
								<Icon
									icon={Icon.icon.LINKEDIN}
									size={32}
								/>
							</Link>
							{resume.contactInfo.websites.map((website) => {
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
												icon={Icon.icon.GLOBE_ALT}
												size={38}
											/>
										) : (
											<Icon
												icon={Icon.icon.GITHUB}
												size={31}
												withBackgroundWhenDarkMode
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
							className="dfr-font-family md:tw-text-justify"
						>
							{resume.summary}
						</Pre>
					</ResumeBlock>
					<ResumeBlock title="Education">
						<Block>
							{resume.education.map((item) => {
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
												variant={Title.variant.SECONDARY}
												size={Title.size.MD}
											>
												{item.degree}
											</Title>
											<Link
												variant={Link.variant.PRIMARY}
												href={item.schoolWebsite}
												className="tw-underline"
												isExternalLink
											>
												{item.school}
											</Link>
											<Text className="tw-text-xs tw-italic dfr-text-color-secondary">
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
						<ExperienceTimeline experience={resume.experience} />
					</ResumeBlock>
				</PrintBlock>

				<PrintBlock className="print:tw-mt-[1200px] print:tw-pt-8">
					<ResumeBlock title="Skills">
						<List variant={List.variant.DEFAULT}>
							{resume.skills.map((item) => {
								return <List.Item key={generateSlug(item)}>{item}</List.Item>;
							})}
						</List>

						<Block className="tw-mt-8 tw-border-t tw-border-dashed tw-pt-8 tw-text-center dfr-border-color-primary print:tw-hidden">
							<Link
								variant={Link.variant.SECONDARY}
								href="https://drive.google.com/file/d/1zOaXbESJ4mXasY0WybvfTD9G9qN2Ya7g/view?usp=sharing"
								isExternalLink
							>
								<Icon
									icon={Icon.icon.ARROW_DOWN_TRAY}
									wrapperClassName="tw-mb-2"
									size={48}
								/>
								<Text>Download this resume as PDF</Text>
							</Link>
						</Block>
					</ResumeBlock>
				</PrintBlock>
			</Block>
		</Page>
	);
}

// --- Components ---

function PrintBlock({
	children,
	fullPage = false,
	className,
}: {
	children: T_ReactChildren;
	fullPage?: boolean;
	className?: string;
}): T_ReactElement {
	return (
		<Block className={classNames("print:tw-py-8", fullPage && "print:tw-h-screen", className)}>
			{children}
		</Block>
	);
}

type T_ResumeBlockProps = {
	title: string;
	children: T_ReactChildren;
};

function ResumeBlock({ title, children }: T_ResumeBlockProps): T_ReactElement {
	return (
		<Block
			is="section"
			className="tw-mt-16 tw-pt-16 print:tw-mb-16 print:tw-mt-0 print:tw-pt-0"
		>
			<Title
				is="h2"
				className="tw-mx-auto tw-mb-8 tw-w-full tw-border-4 tw-py-1 tw-px-2 tw-text-center tw-uppercase dfr-border-color-bw print:tw-w-72 md:tw-w-72"
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

export function ExperienceTimeline({ experience }: T_ExperienceTimelineProps): T_ReactElement {
	return (
		<Block className="tw-ml-3 tw-border-l-4 dfr-border-color-bw">
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
}): T_ReactElement {
	return (
		<Block
			is="section"
			className="tw-relative tw-mb-8 tw-pl-9 last:tw-mb-0 print:tw-mb-20"
		>
			<Block className="tw-absolute tw--left-4 tw-top-0 tw-h-10 tw-w-10 tw-overflow-hidden tw-border-4 dfr-border-color-bw">
				{isNotEmptyString(companyLogo) ? (
					<Image
						src={companyLogo}
						alt="Company logo"
						fill
					/>
				) : (
					<Block className="tw-h-full tw-w-full dfr-bg-color-wb" />
				)}
			</Block>

			<Block>
				<Title
					is="h3"
					variant={Title.variant.SECONDARY}
					size={Title.size.MD}
				>
					{role}
				</Title>

				{isNotEmptyString(companyWebsite) ? (
					<Link
						className="tw-underline"
						href={companyWebsite}
						variant={Link.variant.PRIMARY}
						isExternalLink
					>
						{company}
					</Link>
				) : (
					<Text className="dfr-text-color-bw">{company}</Text>
				)}

				<Text className="tw-text-xs tw-italic dfr-text-color-secondary">
					<InlineText>{startDate}</InlineText> / <InlineText>{endDate}</InlineText>
				</Text>
				<Space size={2} />

				<Pre
					variant={Pre.variant.BREAK_WITH_BLANK_SPACES}
					className="dfr-font-family print:tw-text-sm"
				>
					{description}
				</Pre>
			</Block>
		</Block>
	);
}

// --- Types ---

type T_Resume = {
	profilePhoto: string;
	fullName: string;
	headline: string;
	location: T_Location;
	contactInfo: T_ContactInfo;
	summary: string;
	education: T_Education[];
	experience: T_Experience[];
	skills: string[];
};

type T_Location = {
	from: { country: string; city: string };
	living: { country: string; city: string };
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