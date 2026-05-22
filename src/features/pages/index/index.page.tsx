import { pipe } from "@diegofrayo-pkg/utilities/fp";
import { generateSlug, join } from "@diegofrayo-pkg/utilities/strings";

import TypingTextEffect from "~/components/common/typing-text-effect";
import { Page } from "~/components/layout";
import { Box, Icon, IconCatalog, InlineText, Link, Title } from "~/components/primitive";
import { Routes, WEBSITE_METADATA } from "~/constants";
import AnalyticsService from "~/features/analytics";

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
	const mainTitle = join(["@", WEBSITE_METADATA.username]);
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
				const key = pipe(join([`NavigationLinks`, item.label], "-"), generateSlug);

				return (
					<Box
						key={key}
						className="flex-1 shrink-0 text-center"
					>
						<Link
							href={item.url}
							className="inline-flex items-center justify-center gap-0.5 font-mono text-sm font-bold text-zinc-600"
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
			url: WEBSITE_METADATA.social.x,
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
			className="text-center"
		>
			<Box className="inline-flex justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-100 px-3 py-2">
				{SOCIAL_ICONS.map((item) => {
					const key = pipe(join([`Footer`, item.name], "-"), generateSlug);

					return (
						<Link
							key={key}
							href={item.url}
							onClick={AnalyticsService.trackClickEvent("HOME_PAGE|SOCIAL_NETWORKS", {
								item: item.name,
							})}
							className="inline-flex items-center justify-center rounded-lg p-1 text-black transition-all duration-500 hover:bg-zinc-900 hover:text-white"
							isExternalLink
						>
							<Icon
								icon={item.icon}
								size={24}
							/>
						</Link>
					);
				})}
			</Box>
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
