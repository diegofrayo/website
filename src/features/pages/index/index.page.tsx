import { generateSlug } from "@diegofrayo-pkg/utilities/strings";
import AnalyticsService from "@diegofrayo-features/analytics";
import {
	Box,
	Icon,
	IconCatalog,
	InlineText,
	Link,
	Text,
	Title,
} from "@diegofrayo-features/components/primitive";
import { TypingTextEffect } from "@diegofrayo-features/components/shared";

import { Page } from "~/components/layout";
import { Routes, WEBSITE_METADATA } from "~/constants";

// --- COMPONENT DEFINITION ---

function HomePage() {
	return (
		<Page
			config={{
				isSEOEnabled: metadata.is_seo_enabled === true,
				title: metadata.title,
				description: metadata.description,
				pathname: metadata.pathname,
			}}
		>
			<Box
				as="main"
				className="flex h-full flex-col"
			>
				<Box className="m-auto flex w-full max-w-sm flex-col gap-20 px-4">
					<Header />
					<NavigationLinks />
					<Footer />
				</Box>
			</Box>
		</Page>
	);
}

export default HomePage;

// --- COMPONENTS ---

function Header() {
	const mainTitle = `@${WEBSITE_METADATA.username}`;
	const jobTitle = WEBSITE_METADATA.jobTitle.toLowerCase();

	return (
		<Box as="header">
			<Title
				as="h1"
				className="font-special text-center"
				size={Title.size.XL}
				variant={Title.variant.SIMPLE}
			>
				{mainTitle}
			</Title>

			<TypingTextEffect
				align={TypingTextEffect.align.CENTER}
				className="mt-1.5 text-sm"
				text={jobTitle}
			/>
		</Box>
	);
}

function NavigationLinks() {
	const LINKS = [
		{ icon: IconCatalog.RSS, label: "Blog", url: Routes.BLOG },
		{ icon: IconCatalog.ID_CARD, label: "Resume", url: Routes.RESUME },
		{ icon: IconCatalog.CODE_XML, label: "Portfolio", url: Routes.PORTFOLIO },
	];

	return (
		<Box className="flex items-center justify-center gap-1">
			{LINKS.map((item) => {
				const key = generateSlug(`NavigationLinks-item-List.Item-${item.label}`);

				return (
					<Box
						key={key}
						className="flex-1 shrink-0 text-center"
					>
						<Link
							href={item.url}
							className="inline-block font-mono text-sm font-bold text-zinc-600"
							variant={Link.variant.SMOOTH}
						>
							<Icon
								icon={item.icon}
								size={14}
							/>
							<InlineText className="ml-0.5 leading-none lowercase">{item.label}</InlineText>
						</Link>
					</Box>
				);
			})}
		</Box>
	);
}

function Footer() {
	const SOCIAL_ICONS = [
		{
			icon: IconCatalog.GITHUB_MONO,
			name: "github",
			url: WEBSITE_METADATA.social.github,
		},
		{
			icon: IconCatalog.LINKEDIN_MONO,
			name: "linkedin",
			url: WEBSITE_METADATA.social.linkedin,
		},
		{
			icon: IconCatalog.TWITTER,
			name: "twitter",
			url: WEBSITE_METADATA.social.twitter,
		},
		{
			icon: IconCatalog.INSTAGRAM_MONO,
			name: "instagram",
			url: WEBSITE_METADATA.social.instagram,
		},
	];

	return (
		<Box
			as="footer"
			className="text-center print:hidden"
		>
			<Box className="flex justify-center gap-2">
				{SOCIAL_ICONS.map((item) => {
					const key = generateSlug(`Footer-item-Link-${item.name}`);

					return (
						<Link
							key={key}
							variant={Link.variant.SMOOTH}
							href={item.url}
							onClick={AnalyticsService.trackClickEvent("HOME_PAGE|SOCIAL_NETWORKS", {
								item: item.name,
							})}
							isExternalLink
						>
							<Icon
								icon={item.icon}
								size={32}
							/>
						</Link>
					);
				})}
			</Box>

			<Text className="mt-1 text-sm">
				<InlineText>© 2026 All rights reserved | Coded by </InlineText>
				<InlineText as="strong">Diego Rayo</InlineText>
			</Text>
		</Box>
	);
}

// --- CONSTANTS ---

const metadata = {
	description:
		"I'm a Software Developer. Focused on JavaScript, TypeScript, React, Next.js, Tailwind CSS, and Node.js",
	is_seo_enabled: true,
	pathname: "/",
	title: "",
};
