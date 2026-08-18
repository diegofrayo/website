import { useState } from "react";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";

import cn from "@diegofrayo-pkg/cn";
import { withRenderInBrowser } from "@diegofrayo-pkg/hocs";
import { isPWA } from "@diegofrayo-pkg/utilities/browser";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";
import { isNotEmptyArray } from "@diegofrayo-pkg/validator";

import { MainLayout, Page, type PageMetadata } from "~/components/layout";
import {
	Box,
	Button,
	Icon,
	Image,
	InlineText,
	Link,
	Modal,
	Paragraph,
	Pre,
	Title,
} from "~/components/primitive";
import { IconCatalog } from "~/components/primitive/icon";
import { PORTFOLIO_IMAGES_PATH } from "~/constants/assets";
import AnalyticsService from "~/features/analytics";

import {
	PROFESSIONAL_PROJECTS,
	SIDE_PROJECTS,
	type Project,
	type ProjectType,
} from "./portfolio.constants";

function PortfolioPage() {
	// --- STATE & REFS ---
	const [projectsFilter, setProjectsFilter] = useState<ProjectType>("PROFESSIONAL_PROJECT");

	// --- COMPUTED STATES ---
	const projects = projectsFilter === "SIDE_PROJECT" ? SIDE_PROJECTS : PROFESSIONAL_PROJECTS;

	// --- STYLES ---
	const classes = {
		toggleGroupContainer:
			"mx-auto mb-6 flex w-fit items-center justify-center rounded-full border border-zinc-200 bg-white p-1 text-sm font-medium shadow-sm",
		toggle:
			"cursor-pointer rounded-full px-4 py-1.5 text-zinc-500 transition-colors data-pressed:bg-zinc-900 data-pressed:text-white",
	};

	// --- HANDLERS ---
	function handleProjectsFilterChange(newValue: string[]) {
		if (newValue.length === 0) return;

		const newFilter = newValue[0] as ProjectType;
		setProjectsFilter(newFilter);
		AnalyticsService.trackEvent("PORTFOLIO|SET_PROJECTS_FILTER", { filter: newFilter });
	}

	return (
		<Page config={metadata}>
			<MainLayout title="Portfolio">
				<Box className={classes.toggleGroupContainer}>
					<ToggleGroup
						value={[projectsFilter]}
						onValueChange={handleProjectsFilterChange}
						className="grid grid-cols-2"
					>
						<Toggle
							value="PROFESSIONAL_PROJECT"
							aria-label="Professional projects"
							className={classes.toggle}
						>
							Professional Projects
						</Toggle>
						<Toggle
							value="SIDE_PROJECT"
							aria-label="Side projects"
							className={classes.toggle}
						>
							Side Projects
						</Toggle>
					</ToggleGroup>
				</Box>

				<Box className="flex flex-col gap-6 pt-8">
					{projects.map((item, index) => {
						return (
							<ProjectRow
								key={generateSlug(`PortfolioPage-item-ProjectRow-${index}`)}
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

// --- CONSTANTS ---

const metadata: PageMetadata = {
	title: "Portfolio",
	description: "A showcase of my work and experience.",
	pathname: "/portfolio",
	isSEOEnabled: true,
};

// --- COMPONENTS ---

function ProjectRow({ item }: { item: Project }) {
	// --- STATE & REFS ---
	const [isModalOpen, setIsModalOpen] = useState(false);

	// --- COMPUTED STATES ---
	const imageUrl = `${PORTFOLIO_IMAGES_PATH}/${item.type === "PROFESSIONAL_PROJECT" ? "professional" : "side"}-projects/${item.id}.png`;

	// --- STYLES ---
	const classes = {
		thumbnailButton: cn(
			"group relative aspect-video size-20 shrink-0 cursor-zoom-in overflow-hidden rounded-md border border-zinc-200 bg-white p-0",
			{ "bg-black": item.id.includes("festa") },
		),
		techPill:
			"rounded-full bg-zinc-50 px-2.5 py-0.5 text-xs font-bold text-zinc-700 border border-zinc-200",
	};

	// --- HANDLERS ---
	function handleThumbnailClick() {
		AnalyticsService.trackEvent("PORTFOLIO|ZOOM_IN_PROJECT", { project: item.title });
		setIsModalOpen(true);
	}

	function handleModalClose() {
		setIsModalOpen(false);
	}

	return (
		<>
			<Box
				as="article"
				className="flex gap-4"
			>
				<Button
					variant={Button.variant.UNSTYLED}
					className={classes.thumbnailButton}
					onClick={handleThumbnailClick}
				>
					<Image
						src={imageUrl}
						alt={item.title}
						className="size-full object-contain object-center"
						useNativeElement
					/>
					<Box className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/40">
						<Icon
							name={IconCatalog.ZOOM_IN}
							size={28}
							className="text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
						/>
					</Box>
				</Button>

				<Box className="flex min-w-0 flex-1 flex-col gap-1.5">
					<ProjectTitle item={item} />

					<InlineText className="text-xs text-zinc-400">{item.date}</InlineText>

					<Pre
						variant={Pre.variant.BREAK_WITH_BLANK_LINES}
						className="font-texts text-sm text-zinc-600"
					>
						{item.description}
					</Pre>

					{isNotEmptyArray(item.techStack) && (
						<Box className="flex flex-wrap gap-1.5 pt-1">
							{item.techStack.map((tech, index) => {
								return (
									<InlineText
										key={generateSlug(`ProjectRow-${item.id}-tech-${index}`)}
										className={classes.techPill}
									>
										{tech}
									</InlineText>
								);
							})}
						</Box>
					)}
				</Box>
			</Box>

			<Modal
				visible={isModalOpen}
				className="hide-scrollbar relative flex-col overflow-hidden rounded-md bg-white"
				onCloseHandler={handleModalClose}
			>
				<Box className="relative flex w-full items-center justify-center gap-2 bg-zinc-100 py-2">
					<Paragraph className="px-2 text-sm font-bold">{item.title}</Paragraph>
					<Button
						variant={Button.variant.UNSTYLED}
						className="absolute right-2 flex size-4 items-center justify-center rounded-full bg-red-600"
						onClick={handleModalClose}
					>
						<Icon
							name={IconCatalog.X}
							size={10}
							className="text-white"
						/>
					</Button>
				</Box>
				<Image
					src={imageUrl}
					alt={`${item.title} project thumbnail`}
					className="max-h-[90vh] max-w-[90vw] object-contain"
					useNativeElement
				/>
			</Modal>
		</>
	);
}

function ProjectTitle({ item }: { item: Project }) {
	return (
		<Box className="flex items-center justify-between gap-2">
			<Title
				as="h2"
				size={Title.size.SM}
				variant={Title.variant.SIMPLE}
				className="leading-tight text-black"
			>
				{item.title}
			</Title>
			<Box className="flex items-center gap-2">
				{item.url && <ProjectUrlLink item={item} />}
				{item.github && (
					<Link
						href={`https://github.com/diegofrayo/${item.id}`}
						variant={Link.variant.SMOOTH}
						className="flex w-fit items-center gap-1.5"
						onClick={AnalyticsService.trackClickEvent("PORTFOLIO|OPEN_PROJECT_GITHUB", {
							project: item.id,
						})}
						isExternalLink
					>
						<Icon
							name={IconCatalog.GITHUB_MONO}
							size={18}
							className="text-zinc-700"
						/>
					</Link>
				)}
			</Box>
		</Box>
	);
}

const ProjectUrlLink = withRenderInBrowser(function ProjectUrlLink({ item }: { item: Project }) {
	return (
		<Link
			href={item.url as string}
			variant={Link.variant.SMOOTH}
			isExternalLink={isPWA() === false || !(item.url as string).startsWith("/")}
			className="flex w-fit items-center gap-1.5"
			onClick={AnalyticsService.trackClickEvent("PORTFOLIO|OPEN_PROJECT_URL", {
				project: item.id,
			})}
		>
			<Icon
				name={IconCatalog.EXTERNAL_LINK}
				size={18}
				className="text-zinc-700"
			/>
		</Link>
	);
});
