import { isPWA } from "@diegofrayo-pkg/utilities/browser";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";
import AnalyticsService from "@diegofrayo-features/analytics";
import {
	Box,
	Icon,
	IconCatalog,
	Link,
	Text,
	Title,
	type IconName,
} from "@diegofrayo-features/components/primitive";

import { MainLayout, Page } from "~/components/layout";
import { Routes } from "~/constants";

function PortfolioPage() {
	const PORTFOLIO = [
		{
			title: "kordz",
			icon: IconCatalog.GUITAR,
			url: "https://kordz-dfrz.vercel.app",
			description: "Chords and lyrics for the songs I can play on guitar.",
			tags: [],
		},
		{
			title: "blog",
			icon: IconCatalog.RSS,
			url: Routes.BLOG,
			description: "A static blog, built with React, MDX, and Next.js.",
			tags: [],
		},
		{
			title: "bets",
			icon: IconCatalog.TROPHY,
			url: "https://bets-dfrz.vercel.app",
			description: "A tool for personal use that shows analysis to support my soccer bets.",
			tags: [],
		},
	];

	return (
		<Page
			config={{
				title: "Portfolio",
				description: "Some projects for learning purposes and personal use",
				pathname: "/portfolio",
				isSEOEnabled: false,
			}}
		>
			<MainLayout title="Portfolio">
				<Box className="mx-auto flex w-full max-w-sm flex-col gap-6">
					{PORTFOLIO.map((item, index) => {
						return (
							<ProjectBox
								key={generateSlug(`PortfolioPage-item-ProjectBox-${index}`)}
								item={item}
							/>
						);
					})}
				</Box>
			</MainLayout>
		</Page>
	);
}

export default PortfolioPage;

// --- COMPONENTS ---

function ProjectBox({ item }: { item: Demo }) {
	return (
		<Box
			as="article"
			className="flex items-start justify-between gap-2"
		>
			<Icon
				icon={item.icon}
				size={48}
				wrapperClassName="rounded-md bg-linear-to-b from-black to-zinc-600 p-2 text-white"
			/>

			<Box className="flex-1">
				<Title
					as="h1"
					size={Title.size.SM}
					className="leading-tight text-black"
					variant={Title.variant.SIMPLE}
				>
					{item.title}
				</Title>
				<Text className="text-sm">{item.description}</Text>
			</Box>

			<Box className="place-self-end leading-none">
				<Link
					href={item.url}
					variant={Link.variant.SMOOTH}
					isExternalLink={isPWA() === false || !item.url.startsWith("/")}
					onClick={AnalyticsService.trackClickEvent("PORTFOLIO|OPEN_PROJECT", {
						project: item.title,
					})}
				>
					<Icon icon={IconCatalog.EXTERNAL_LINK} />
				</Link>
			</Box>
		</Box>
	);
}

// --- TYPES ---

type Demo = {
	title: string;
	icon: IconName;
	url: string;
	description: string;
	tags: string[];
};
