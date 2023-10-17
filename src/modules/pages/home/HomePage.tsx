import * as React from "react";
import cn from "classnames";

import { MainLayout, Page } from "~/components/layout";
import { Block, Button, Icon, Image, InlineText, Space } from "~/components/primitive";
import AnalyticsService from "~/modules/analytics";
import { createArray } from "@diegofrayo/utils/arrays-and-objects";
import { generateSlug } from "@diegofrayo/utils/strings";
import type { T_PageContent } from "~/data/loader";

import styles from "./HomePage.styles.module.css";

// --- COMPONENT DEFINITION ---

export type T_HomePageProps = {
	content: T_PageContent;
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

function HomePage({ content, data }: T_HomePageProps) {
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
				<Block className="sm:tw-py-12">
					<Room
						song={data.song}
						image={data.photo}
					/>
				</Block>
			</MainLayout>
		</Page>
	);
}

export default HomePage;

// --- COMPONENTS ---

type T_RoomProps = {
	song: T_HomePageProps["data"]["song"];
	image: T_HomePageProps["data"]["photo"];
};

function Room({ song, image }: T_RoomProps) {
	return (
		<Block
			className="tw-relative tw-mx-auto tw-w-80 tw-max-w-full tw-overflow-hidden tw-rounded-3xl tw-bg-black tw-px-2 tw-pt-16"
			style={{
				backgroundImage: 'url("/assets/images/textures/green-gobbler.png")',
			}}
		>
			<PictureFrame photo={image} />
			<Space size={8} />

			<Radio song={song} />
			<Table />

			<React.Fragment>
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
			</React.Fragment>
		</Block>
	);
}

type T_PictureFrameProps = {
	photo: T_RoomProps["image"];
};

function PictureFrame({ photo }: T_PictureFrameProps) {
	// --- HANDLERS ---
	function handleImageClick(): void {
		AnalyticsService.trackEvent("HOME|PICTURE_FRAME", { action: "CLICK" });
	}

	return (
		<Block className={cn(styles["picture-frame"], "tw-relative tw-mx-auto tw-w-32 tw-rounded-md")}>
			<Block className="tw-h-20 tw-rounded-md tw-border-4 tw-border-white">
				<Block className="tw-relative tw-wh-full">
					<Image
						src={photo.src}
						alt="Photography taken by Diego Rayo"
						onClick={handleImageClick}
						fill
					/>
				</Block>
			</Block>
		</Block>
	);
}

type T_RadioProps = {
	song: T_RoomProps["song"];
};

function Radio({ song }: T_RadioProps) {
	// --- STATES & REFS ---
	const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);

	// --- HANDLERS ---
	function handlePlayAndPauseClick(): void {
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

	function onSongEndedHandler(): void {
		setIsAudioPlaying(false);
	}

	// --- UTILS ---
	function getAudioElement(): HTMLAudioElement {
		return document.getElementById("radio-audio") as HTMLAudioElement;
	}

	return (
		<Block className="tw-mx-auto tw-w-24">
			<Block className="tw-text-center tw-leading-0">
				{createArray(4).map((item) => {
					return (
						<Block
							key={generateSlug(`Radio-Block-Item-Button-${item}`)}
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
					{createArray(17).map((item) => {
						return (
							<Block
								key={generateSlug(`Radio-Block-Item-Lines-${item}`)}
								className={cn(
									"tw-mx-0.5 tw-inline-block tw-w-px tw-border-l tw-border-black",
									item % 2 === 0 ? "tw-h-2" : "tw-h-1",
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
