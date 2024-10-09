import * as React from "react";
import * as RadixHoverCard from "@radix-ui/react-hover-card";
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
	Space,
	Title,
} from "~/components/primitive";
import WEBSITE_METADATA from "~/data/metadata.json";
import { withOnlyClientRender } from "~/hocs";
import AnalyticsService from "~/modules/analytics";
import { ComponentWithAuth } from "~/modules/auth";
import type { T_PageContent } from "~/server/data-loader";
import { createArray } from "@diegofrayo/utils/arrays-and-objects";
import { generateSlug } from "@diegofrayo/utils/strings";

import { getImageOrientation } from "@diegofrayo/utils/misc";
import { useAsync } from "@diegofrayo/hooks";
import styles from "./HomePage.styles.module.css";

// --- COMPONENT DEFINITION ---

export type T_HomePageProps = {
	cmsContent: T_PageContent;
	data: {
		song: {
			title: string;
			artist: string;
			thumbnail: string;
			audio: string;
			url: string;
			source: string;
		};
		photo: {
			src: string;
		};
	};
};

function HomePage({ cmsContent, data }: T_HomePageProps) {
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
				<Block className="sm:tw-py-12">
					<Room song={data.song} />
				</Block>
			</MainLayout>
		</Page>
	);
}

export default HomePage;

// --- COMPONENTS ---

type T_RoomProps = {
	song: T_HomePageProps["data"]["song"];
};

function Room({ song }: T_RoomProps) {
	return (
		<Block
			className="tw-relative tw-mx-auto tw-w-80 tw-max-w-full tw-overflow-hidden tw-rounded-3xl tw-bg-black tw-px-2 tw-pt-16"
			style={{
				backgroundImage: 'url("/assets/images/textures/green-gobbler.png")',
			}}
		>
			<PictureFrame />
			<Space size={8} />

			<Radio song={song} />
			<Table />

			<ComponentWithAuth
				roles={["ADMIN"]}
				className="tw-absolute tw--bottom-1 tw-left-0 tw-overflow-hidden tw-rounded-full tw-bg-black"
			>
				<StackPopover />
			</ComponentWithAuth>

			<ComponentWithAuth
				roles={["ADMIN"]}
				withoutContainer
			>
				<Icon
					icon={Icon.icon.SOCCER}
					size={40}
					wrapperClassName="tw-absolute tw-right-4 tw--bottom-1"
				/>
				<Icon
					icon={Icon.icon.GUITAR}
					size={80}
					wrapperClassName="tw-absolute tw--right-7 tw-bottom-0 tw--rotate-45"
				/>
			</ComponentWithAuth>
		</Block>
	);
}

const PictureFrame = withOnlyClientRender(function PictureFrame() {
	// --- VARS ---
	const imageSrc = `/assets/images/pages/home/assets/IMG_${new Date().getDate()}.jpg`;

	// --- HOOKS ---
	const { data: imageOrientation } = useAsync("image", () => getImageOrientation(imageSrc), {
		autoLaunch: true,
	});

	// --- STATES & REFS ---
	const isPortrait = imageOrientation === "portrait";
	const isLandscape = imageOrientation === "landscape";

	return (
		<Block
			className={cn(
				styles["picture-frame"],
				styles[`picture-frame--${imageOrientation}`],
				"tw-relative tw-mx-auto tw-rounded-md",
				isLandscape ? "tw-w-32" : isPortrait ? "tw-w-24" : "tw-w-24",
			)}
		>
			<Block
				className={cn(
					"tw-rounded-md tw-border-4 tw-border-white",
					isLandscape ? "tw-h-20" : isPortrait ? "tw-h-32" : "tw-h-24",
				)}
			>
				<Block className="tw-relative tw-wh-full">
					<Image
						src={imageSrc}
						alt="Photography taken by Diego Rayo"
						fill
					/>
				</Block>
			</Block>
		</Block>
	);
});

type T_RadioProps = {
	song: T_RoomProps["song"];
};

function Radio({ song }: T_RadioProps) {
	// --- STATES & REFS ---
	const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);

	// --- HANDLERS ---
	function handlePlayAndPauseClick() {
		setIsAudioPlaying((currentValue) => !currentValue);

		const audioElement = getAudioElement();
		AnalyticsService.trackEvent("HOME|DEVICE", { action: audioElement.paused ? "PLAY" : "PAUSE" });

		if (audioElement.paused) {
			audioElement.play();
			audioElement.volume = 0.5;
		} else {
			audioElement.pause();
		}
	}

	function onSongEndedHandler() {
		setIsAudioPlaying(false);
	}

	// --- UTILS ---
	function getAudioElement(): HTMLAudioElement {
		return document.getElementById("radio-audio") as HTMLAudioElement;
	}

	return (
		<Block className="tw-mx-auto tw-w-24">
			<Block className="tw-text-center tw-leading-0">
				{createArray(4).map((button) => {
					return (
						<Block
							key={generateSlug(`Radio-Block-button-${button}`)}
							className={cn(
								"tw-mr-0.5 tw-inline-block tw-h-2 tw-w-3 tw-rounded-t-sm tw-border tw-border-b-0 tw-border-black tw-bg-gray-500 last:tw-mr-0 last:tw-bg-red-700",
								isAudioPlaying && "last:tw-h-1",
							)}
						/>
					);
				})}
			</Block>
			<Block className="tw-rounded-md tw-border tw-border-b-0 tw-border-black tw-bg-gradient-to-b tw-from-gray-500 tw-to-gray-700 tw-px-1 tw-py-1">
				<Block className="tw-flex tw-items-start tw-justify-center tw-rounded-md tw-border tw-border-t-2 tw-border-black tw-bg-white tw-pb-0.5">
					{createArray(17).map((line) => {
						return (
							<Block
								key={generateSlug(`Radio-Block-item-${line}`)}
								className={cn(
									"tw-mx-0.5 tw-inline-block tw-w-px tw-border-l tw-border-black",
									line % 2 === 0 ? "tw-h-2" : "tw-h-1",
								)}
							/>
						);
					})}
				</Block>
				<Space size={0.5} />
				<Block className="tw-flex tw-gap-1 tw-px-2">
					<Block
						className={cn(
							"tw-relative tw-flex tw-flex-shrink-0 tw-items-center tw-justify-center tw-overflow-hidden tw-rounded-full tw-border tw-border-black tw-wh-10",
							isAudioPlaying ? "tw-animate-spin-slow" : "tw-rotate-45",
						)}
						style={{
							backgroundSize: "3px 3px",
							backgroundImage:
								"linear-gradient(to right, black 1px, transparent 1px),                linear-gradient(to bottom, black 1px, transparent 1px)",
						}}
					>
						<Image
							src={song.thumbnail}
							alt={`${song.title} | ${song.artist}`}
							className="tw-rounded-full tw-border tw-border-black tw-wh-6"
							useNativeImage
						/>
					</Block>
					<Block className="tw-flex tw-flex-1 tw-items-center tw-justify-end">
						<Button
							variant={Button.variant.SIMPLE}
							onClick={handlePlayAndPauseClick}
						>
							<Icon
								icon={isAudioPlaying ? Icon.icon.PAUSE : Icon.icon.PLAY_SOLID}
								size={14}
								wrapperClassName="tw-bg-black/70 tw-rounded-full tw-p-1"
								iconClassName={isAudioPlaying ? "" : "tw-animate-pulse"}
								color={isAudioPlaying ? "tw-text-red-500" : "tw-text-green-500"}
							/>
							<audio
								id="radio-audio"
								className="tw-hidden"
								onEnded={onSongEndedHandler}
							>
								<source
									type="audio/mpeg"
									src={song.audio}
								/>
							</audio>
						</Button>
					</Block>
				</Block>
			</Block>
		</Block>
	);
}

function Table() {
	return (
		<Block className="tw-relative tw-overflow-hidden">
			<Block className="tw-mx-auto tw-w-5/12 tw-border-4 tw-border-b-0 tw-border-yellow-900 tw-pb-3">
				<Block className="tw-bg-yellow-900">
					<Block className="tw-flex tw-flex-1 tw-items-center tw-justify-center tw-bg-yellow-700 tw-py-2">
						<InlineText className="tw-mx-4 tw-inline-block tw-rounded-full tw-bg-yellow-400 tw-wh-1" />
						<InlineText className="tw-mx-4 tw-inline-block tw-rounded-full tw-bg-yellow-400 tw-wh-1" />
					</Block>
					<Space size={0.5} />
					<Block className="tw-flex tw-flex-1 tw-items-center tw-justify-center tw-bg-yellow-700 tw-py-2">
						<InlineText className="tw-mx-4 tw-inline-block tw-rounded-full tw-bg-yellow-400 tw-wh-1" />
						<InlineText className="tw-mx-4 tw-inline-block tw-rounded-full tw-bg-yellow-400 tw-wh-1" />
					</Block>
					<Space size={0.5} />
					<Block className="tw-flex tw-flex-1 tw-items-center tw-justify-center tw-bg-yellow-700 tw-py-2">
						<InlineText className="tw-mx-4 tw-inline-block tw-rounded-full tw-bg-yellow-400 tw-wh-1" />
						<InlineText className="tw-mx-4 tw-inline-block tw-rounded-full tw-bg-yellow-400 tw-wh-1" />
					</Block>
					<Space size={1} />
				</Block>
			</Block>
		</Block>
	);
}

function StackPopover() {
	// --- STATES & REFS ---
	const [isHoverCardOpen, setIsHoverCardOpen] = React.useState(false);

	// --- HANDLERS ---
	function onHoverCardToggleHandler() {
		setIsHoverCardOpen((isOpen) => {
			AnalyticsService.trackEvent("HOME|TECH_STACK", { action: isOpen ? "CLOSE" : "OPEN" });

			return !isOpen;
		});
	}

	return (
		<RadixHoverCard.Root open={isHoverCardOpen}>
			<RadixHoverCard.Trigger>
				<Block
					className="tw-inline-block tw-cursor-context-menu tw-p-1"
					onClick={onHoverCardToggleHandler}
				>
					<Icon
						icon={Icon.icon.STACK}
						color="tw-text-white"
					/>
				</Block>
			</RadixHoverCard.Trigger>
			<RadixHoverCard.Content
				className="radix-hover-card-content"
				side="bottom"
				collisionPadding={20}
				onMouseLeave={onHoverCardToggleHandler}
			>
				<Block
					is="section"
					className="tw-rounded-md tw-border tw-px-3 tw-py-2 tw-text-sm dr-bg-color-surface-200 dr-border-color-surface-300"
				>
					<Block className="tw-flex tw-justify-between tw-text-white">
						<Title
							is="h2"
							className="tw-text-center tw-text-base tw-font-bold"
						>
							TECH STACK
						</Title>
						<Link
							variant={Link.variant.SIMPLE}
							href={`${WEBSITE_METADATA.social.github}/website`}
							className="tw-inline-block"
							onClick={AnalyticsService.trackClickEvent("HOME|TECH_STACK|ITEM", { item: "github" })}
							isExternalLink
						>
							<Icon icon={Icon.icon.CODE} />
						</Link>
					</Block>
					<Space size={0.5} />
					<List
						variant={List.variant.SIMPLE}
						className="tw-text-left"
					>
						<List.Item>
							<StackItem
								toolName="typescript"
								href="https://typescriptlang.org"
								description="as the main language"
							/>
						</List.Item>
						<List.Item>
							<StackItem
								toolName="next.js"
								href="https://nextjs.org"
								description="as web framework"
							/>
						</List.Item>
						<List.Item>
							<StackItem
								toolName="tailwindcss"
								href="https://tailwindcss.com"
								description="as css framework"
							/>
						</List.Item>
						<List.Item>
							<StackItem
								toolName="vercel"
								href="https://vercel.com"
								description="as hosting platform"
							/>
						</List.Item>
					</List>
				</Block>

				<RadixHoverCard.Arrow
					width={20}
					height={10}
					className="radix-hover-card-arrow tw-relative tw--top-1 tw-fill-[var(--dr-color-surface-300)]"
				/>
			</RadixHoverCard.Content>
		</RadixHoverCard.Root>
	);
}

type T_StackItemProps = {
	toolName: string;
	href: string;
	description: string;
};

function StackItem({ toolName, href, description }: T_StackItemProps) {
	return (
		<React.Fragment>
			<Link
				variant={Link.variant.SIMPLE}
				href={href}
				className="tw-font-bold tw-underline"
				onClick={AnalyticsService.trackClickEvent("HOME|TECH_STACK|ITEM", { item: toolName })}
				isExternalLink
			>
				<InlineText>{toolName}</InlineText>
				<Icon
					icon={Icon.icon.EXTERNAL_LINK}
					wrapperClassName="tw-ml-0.5 tw-mr-1.5"
					size={12}
				/>
			</Link>
			<InlineText>{description}</InlineText>
		</React.Fragment>
	);
}
