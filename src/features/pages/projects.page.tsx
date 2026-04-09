import { useState } from "react";

import { isPWA } from "@diegofrayo-pkg/utilities/browser";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";

import { MainLayout, Page } from "~/components/layout";
import {
	Box,
	Button,
	Icon,
	IconCatalog,
	Image,
	Link,
	Modal,
	Text,
	Title,
} from "~/components/primitive";
import { Routes } from "~/constants";
import { PROJECTS_IMAGES_PATH } from "~/constants/assets";
import AnalyticsService from "~/features/analytics";

function ProjectsPage() {
	const PROJECTS = [
		{
			title: "kordz",
			image: `${PROJECTS_IMAGES_PATH}/kordz.webp`,
			url: "https://kordz.diegofrayo.dev",
			description: "Chords and lyrics for the songs I can play on guitar.",
		},
		{
			title: "blog",
			image: `${PROJECTS_IMAGES_PATH}/blog.webp`,
			url: Routes.BLOG,
			description: "A static blog, built with React, MDX, and Next.js.",
		},
		{
			title: "bets",
			image: `${PROJECTS_IMAGES_PATH}/bets.webp`,
			url: "https://bets.diegofrayo.dev",
			description: "A tool for personal use that shows analysis to support my soccer bets.",
		},
	];

	return (
		<Page
			config={{
				title: "Projects",
				description: "Some projects for learning purposes and personal use",
				pathname: "/projects",
				isSEOEnabled: false,
			}}
		>
			<MainLayout title="Projects">
				<Text className="mb-4 text-center text-sm italic">Some side projects for personal use</Text>
				<Box className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{PROJECTS.map((item, index) => {
						return (
							<ProjectBox
								key={generateSlug(`ProjectsPage-item-ProjectBox-${index}`)}
								item={item}
							/>
						);
					})}
				</Box>
			</MainLayout>
		</Page>
	);
}

export default ProjectsPage;

// --- COMPONENTS ---

function ProjectBox({ item }: { item: Project }) {
	// --- STATE ---
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<Box
				as="article"
				className="relative mx-auto flex w-full max-w-lg flex-col overflow-hidden rounded-md border border-zinc-200 shadow-md"
			>
				<Box
					className="group relative h-48 cursor-zoom-in overflow-hidden border-b border-zinc-200 bg-zinc-100 shadow-inner"
					onClick={() => setIsModalOpen(true)}
				>
					<img
						src={item.image}
						alt={item.title}
						className="h-full w-full object-cover object-top"
					/>
					<Box className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/40">
						<Icon
							icon={IconCatalog.ZOOM_IN}
							size={36}
							color="text-white"
							wrapperClassName="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
						/>
					</Box>
				</Box>

				<Box className="flex flex-1 flex-col gap-1 p-3 pb-10">
					<Title
						as="h2"
						size={Title.size.SM}
						className="leading-tight text-black"
						variant={Title.variant.SIMPLE}
					>
						{item.title}
					</Title>
					<Text className="text-sm text-zinc-600">{item.description}</Text>
				</Box>

				<Box className="absolute right-3 bottom-3">
					<Link
						href={item.url}
						variant={Link.variant.SMOOTH}
						isExternalLink={isPWA() === false || !item.url.startsWith("/")}
						onClick={AnalyticsService.trackClickEvent("PROJECTS|OPEN_PROJECT", {
							project: item.title,
						})}
					>
						<Icon
							icon={IconCatalog.EXTERNAL_LINK}
							color="text-black"
						/>
					</Link>
				</Box>
			</Box>

			<Modal
				visible={isModalOpen}
				className="hide-scrollbar relative flex-col"
				onCloseHandler={() => setIsModalOpen(false)}
			>
				<Button
					variant={Button.variant.SMOOTH}
					className="ml-auto block rounded-t-sm bg-red-500/60 px-2 py-0.5 text-white"
					onClick={() => setIsModalOpen(false)}
				>
					<Icon
						icon={IconCatalog.X}
						size={16}
						color="text-white"
					/>
				</Button>
				<Image
					src={item.image}
					alt={`${item.title} project thumbnail`}
					className="max-h-[90vh] max-w-[90vw] object-contain"
					useNativeElement
				/>
			</Modal>
		</>
	);
}

// --- TYPES ---

type Project = {
	title: string;
	image: string;
	url: string;
	description: string;
};
