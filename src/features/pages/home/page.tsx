import * as React from "react";
import cn from "classnames";

import { MainLayout, Page } from "~/components/layout";
import { Block, Button, Icon, Image, InlineText, Space } from "~/components/primitive";
import { createArray } from "@diegofrayo/utils/arrays-and-objects";
import { generateSlug } from "@diegofrayo/utils/strings";
import type { T_PageContent } from "~/data/loader";

import styles from "./styles.module.css";

// --- COMPONENT DEFINITION ---

export type T_HomePageProps = {
	content: T_PageContent;
	data: {
		featured: Array<{
			text: string;
			url: string;
		}>;
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
			portrait: boolean;
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
						tvSong={data.song}
						frameImage={data.photo}
					/>
				</Block>
			</MainLayout>
		</Page>
	);
}

export default HomePage;

// --- COMPONENTS ---

type T_RoomProps = {
	tvSong: T_HomePageProps["data"]["song"];
	frameImage: T_HomePageProps["data"]["photo"];
};

function Room({ tvSong, frameImage }: T_RoomProps) {
	return (
		<Block
			className="tw-relative tw-mx-auto tw-w-80 tw-max-w-full tw-overflow-hidden tw-rounded-3xl tw-bg-black tw-px-2 tw-pt-16"
			style={{
				backgroundImage: 'url("/assets/images/textures/green-gobbler.png")',
			}}
		>
			<PictureFrame photo={frameImage} />
			<Space size={8} />

			<TV song={tvSong} />
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
	photo: T_RoomProps["frameImage"];
};

function PictureFrame({ photo }: T_PictureFrameProps) {
	// --- HANDLERS ---
	function handleImageClick(): void {
		// TODO
		// AnalyticsService.trackEvent("HOME|PICTURE_FRAME", { action: "CLICK" });
	}

	return (
		<Block
			className={cn(
				styles["picture-frame"],
				"tw-relative tw-mx-auto tw--rotate-2 tw-rounded-md tw-transition-transform hover:tw-rotate-0",
				photo.portrait === true ? "dr-picture-frame--portrait tw-w-20" : "tw-w-32",
			)}
		>
			<Block
				className={cn(
					"tw-border-4 tw-border-yellow-500 tw-bg-white tw-p-1.5",
					photo.portrait === true ? "tw-h-24" : "tw-h-20",
				)}
			>
				<Block className="tw-relative tw-overflow-hidden tw-rounded-md tw-border tw-border-yellow-500 tw-wh-full">
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

type T_TVProps = {
	song: T_RoomProps["tvSong"];
};

function TV({ song }: T_TVProps) {
	// --- STATES & REFS ---
	const [showInfo, setShowInfo] = React.useState(false);
	const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);
	const [hasNotStartedTV, setHasNotStartedTV] = React.useState(true);

	// --- EFFECTS ---
	React.useEffect(() => {
		if (showInfo === false) {
			setIsAudioPlaying(false);
			getAudioElement().pause();
		}
	}, [showInfo]);

	// --- HANDLERS ---
	function handlePlayAndPauseClick(): void {
		const audioElement = getAudioElement();
		setIsAudioPlaying((currentValue) => !currentValue);
		// TODO
		// AnalyticsService.trackEvent("HOME|TV", { action: audioElement.paused ? "PLAY" : "PAUSE" });

		if (audioElement.paused) {
			audioElement.play();
			audioElement.volume = 0.5;
		} else {
			audioElement.pause();
		}
	}

	function handleStartTVClick(): void {
		// TODO
		// AnalyticsService.trackEvent("HOME|TV", { action: "START" });
		setHasNotStartedTV(false);
		setShowInfo(true);
	}

	function handleToggleTurnOnTVClick(): void {
		getAudioElement().currentTime = 0;
		setShowInfo((currentValue) => {
			// TODO
			// AnalyticsService.trackEvent("HOME|TV", { action: currentValue ? "TURN_OFF" : "TURN_ON" });
			return !currentValue;
		});
	}

	function onSongEndedHandler(): void {
		setShowInfo(false);
	}

	// --- UTILS ---
	function getAudioElement(): HTMLAudioElement {
		return document.getElementById("tv-audio") as HTMLAudioElement;
	}

	return (
		<Block
			className={cn(
				styles["tv"],
				"tw-relative tw-mx-auto tw-mb-2 tw-flex tw-w-28 tw-max-w-full tw-items-stretch tw-rounded-md tw-bg-gradient-to-b tw-from-gray-500 tw-to-gray-700 tw-p-2",
			)}
		>
			<Block className="tw-relative tw-overflow-hidden tw-wh-16">
				<Block
					className="tw-relative tw-flex tw-h-full tw-items-center tw-justify-center tw-bg-cover"
					title={`${song.title} - ${song.artist}`}
					style={{ backgroundImage: `url(${song.thumbnail})` }}
				>
					<Button
						variant={Button.variant.SIMPLE}
						onClick={handlePlayAndPauseClick}
					>
						<Icon
							icon={isAudioPlaying ? Icon.icon.PAUSE : Icon.icon.PLAY}
							wrapperClassName="tw-bg-black/70 tw-rounded-full tw-p-1"
							color="tw-text-white"
						/>
						<audio
							id="tv-audio"
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
				<Block
					className={cn(
						"tw-absolute tw-left-0 tw-top-0 tw-bg-black tw-transition-transform tw-wh-full",
						showInfo && "tw-translate-x-full",
					)}
				/>
			</Block>
			<Space
				size={1}
				orientation="v"
			/>

			<Block className="tw-flex tw-flex-1 tw-flex-col tw-items-center tw-justify-between tw-py-1">
				<Block className="tw-w-full tw-text-center">
					{createArray(8).map((i) => {
						return (
							<Block
								key={generateSlug(`TV-Block-i-${i}`)}
								className="tw-my-0.5 tw-rounded-md tw-border-b tw-border-gray-400 tw-bg-transparent"
							/>
						);
					})}
				</Block>
				<Block className="tw-overflow-hidden tw-rounded-full tw-bg-black tw-transition-transform tw-wh-6">
					{hasNotStartedTV ? (
						<Button
							className="tw-flex tw-items-center tw-justify-center tw-wh-full"
							onClick={handleStartTVClick}
						>
							<Block className="tw-relative tw-animate-ping tw-rounded-full tw-bg-green-500 tw-wh-2" />
						</Button>
					) : (
						<Button
							className={cn("tw-transition-transform tw-wh-full", showInfo && "tw-rotate-90")}
							onClick={handleToggleTurnOnTVClick}
						>
							<Block
								className={cn(
									"tw-relative tw--top-2 tw-mx-auto tw-h-4 tw-w-0.5",
									showInfo ? "tw-bg-green-500" : "tw-bg-red-500",
								)}
							/>
						</Button>
					)}
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
