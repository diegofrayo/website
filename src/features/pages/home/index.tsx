import * as React from "react";
import classNames from "classnames";

import { Page, MainLayout } from "~/components/layout";
import {
	Block,
	Button,
	Icon,
	Image,
	InlineText,
	Link,
	Space,
	Text,
	Title,
} from "~/components/primitive";
import { Emoji, ProtectedComponent } from "~/components/shared";
import { AnalyticsService } from "~/features/analytics";
import { useTranslation } from "~/features/i18n";
import { createArray } from "~/utils/objects-and-arrays";
import { ROUTES } from "~/features/routing";
import { generateSlug } from "~/utils/strings";
import type { T_ReactElement, T_ReactElementNullable } from "~/types";

import styles from "./index.styles.module.css";

type T_HomeProps = {
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
			portrait: boolean;
		};
		featured: { text: string; url: string }[];
	};
};

function Home({ data }: T_HomeProps): T_ReactElement {
	// hooks
	const { t } = useTranslation();

	return (
		<Page
			config={{
				title: t("seo:title"),
				description: t("seo:description"),
				pathname: ROUTES.HOME,
				disableSEO: Boolean(t("page:config:is_seo_disabled")),
			}}
		>
			<MainLayout title="">
				<Block className="tw-mx-auto tw-w-72 tw-max-w-full">
					<Featured content={data.featured} />
					<Space size={4} />
					<Block className="tw-overflow-hidden tw-rounded-t-md dfr-shadow">
						<Room
							tvSong={data.song}
							frameImage={data.photo}
						/>
					</Block>
				</Block>
			</MainLayout>
		</Page>
	);
}

export default Home;

// --- Components ---

type T_Featured = {
	content: T_HomeProps["data"]["featured"];
};

function Featured({ content }: T_Featured): T_ReactElement {
	// handlers
	function handleItemClick(itemText: string): () => void {
		return function onItemClickHandler() {
			AnalyticsService.trackEvent("HOME|FEATURED", { page: itemText });
		};
	}

	return (
		<ProtectedComponent>
			<Block
				is="section"
				className="tw-relative tw-rounded-t-md tw-border-8 tw-border-yellow-700 tw-bg-green-700 tw-p-4"
			>
				<Emoji className="tw-absolute tw--top-4 tw--left-4 tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-full tw-text-sm dfr-shadow dfr-bg-color-gs-white">
					📌
				</Emoji>
				<Title
					is="h1"
					variant={Title.variant.UNSTYLED}
					className="tw-text-center dfr-text-color-gs-white"
					size={Title.size.MD}
				>
					FEATURED
				</Title>
				<Space size={2} />
				<Block className="tw-flex tw-flex-wrap tw-items-center tw-justify-between">
					{content.map((item, index) => {
						return (
							<Link
								key={generateSlug(item.text)}
								variant={Link.variant.SIMPLE}
								href={item.url}
								className={classNames(
									"tw-mt-3 tw-inline-block tw-text-sm tw-text-yellow-300",
									index % 2 === 0 ? "tw-rotate-1" : "tw--rotate-1",
								)}
								onClick={handleItemClick(item.text)}
							>
								<Emoji>🖇️</Emoji>
								<InlineText className="tw-mx-1 tw-underline">{item.text}</InlineText>
							</Link>
						);
					})}
				</Block>
			</Block>
		</ProtectedComponent>
	);
}

type T_RoomProps = {
	tvSong: T_HomeProps["data"]["song"];
	frameImage: T_HomeProps["data"]["photo"];
};

function Room({ tvSong, frameImage }: T_RoomProps): T_ReactElement {
	return (
		<Block
			className="tw-border-b-4 tw-border-yellow-900 tw-bg-gray-100 tw-px-6 tw-pt-16 dark:tw-border-0 dark:tw-bg-gray-700 sm:tw-px-10"
			style={{ backgroundImage: "url('/static/images/textures/arabesque.png')" }}
		>
			<PictureFrame photo={frameImage} />
			<Block className="tw-relative tw-flex tw-items-end tw-justify-center tw-overflow-hidden">
				<TV song={tvSong} />
				<Block className="tw-absolute tw-left-0">
					<Flowers />
				</Block>
			</Block>
			<Table />
		</Block>
	);
}

type T_PictureFrameProps = {
	photo: T_RoomProps["frameImage"];
};

function PictureFrame({ photo }: T_PictureFrameProps): T_ReactElementNullable {
	// hooks
	const { t } = useTranslation();

	// handlers
	function handleImageClick(): void {
		AnalyticsService.trackEvent("HOME|PICTURE_FRAME", { action: "CLICK" });
	}

	return (
		<Block
			className={classNames(
				"dfr-PictureFrame tw-relative tw-mx-auto tw-mb-8 tw-rotate-2 tw-transition-transform hover:tw-rotate-0",
				photo.portrait === true ? "dfr-PictureFrame--portrait tw-w-20" : "tw-w-32",
			)}
		>
			<Block
				className={classNames(
					"tw-border-2 tw-border-yellow-700 tw-bg-yellow-900 tw-p-1",
					photo.portrait === true ? "tw-h-24" : "tw-h-20",
				)}
			>
				<Block className="tw-relative tw-h-full tw-w-full tw-overflow-hidden tw-rounded-md tw-border-2 tw-border-yellow-700">
					<Image
						src={photo.src}
						alt="Photography taken by Diego Rayo"
						className="dfr-transition-opacity"
						onClick={handleImageClick}
						fill
					/>
				</Block>
			</Block>
			<Text className="tw-mx-auto tw-h-4 tw-w-16 tw-rounded-bl-md tw-rounded-br-md tw-border-2 tw-border-t-0 tw-border-yellow-700 tw-text-center tw-text-xxs tw-font-bold tw-italic dfr-bg-color-gs-white dfr-text-color-gs-black">
				{t("layout:header:room:welcome")}
			</Text>

			<style jsx>
				{`
					:global(.dfr-PictureFrame)::before,
					:global(.dfr-PictureFrame)::after {
						background-color: var(--dfr-bg-color-bw);
						content: " ";
						display: block;
						height: 50px;
						position: absolute;
						top: -40px;
						width: 2.5px;
						z-index: -1;
					}

					:global(.dfr-PictureFrame)::before {
						transform: rotate(45deg);
						left: 46px;
					}

					:global(.dfr-PictureFrame)::after {
						transform: rotate(-45deg);
						right: 46px;
					}

					:global(.dfr-PictureFrame--portrait)::before,
					:global(.dfr-PictureFrame--portrait)::after {
						height: 24px;
						top: -17px;
					}

					:global(.dfr-PictureFrame--portrait)::before {
						transform: rotate(-40deg);
					}

					:global(.dfr-PictureFrame--portrait)::after {
						transform: rotate(40deg);
					}
				`}
			</style>
		</Block>
	);
}

type T_TVProps = {
	song: T_RoomProps["tvSong"];
};

function TV({ song }: T_TVProps): T_ReactElement {
	// states
	const [showInfo, setShowInfo] = React.useState(false);
	const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);
	const [hasNotStartedTV, setHasNotStartedTV] = React.useState(true);

	// effects
	React.useEffect(() => {
		if (showInfo === false) {
			setIsAudioPlaying(false);
			getAudioElement().pause();
		}
	}, [showInfo]);

	// handlers
	function handlePlayAndPauseClick(): void {
		const audioElement = getAudioElement();
		setIsAudioPlaying((currentValue) => !currentValue);
		AnalyticsService.trackEvent("HOME|TV", { action: audioElement.paused ? "PLAY" : "PAUSE" });

		if (audioElement.paused) {
			audioElement.play();
			audioElement.volume = 0.5;
		} else {
			audioElement.pause();
		}
	}

	function handleStartTVClick(): void {
		AnalyticsService.trackEvent("HOME|TV", { action: "START" });
		setHasNotStartedTV(false);
		setShowInfo(true);
	}

	function handleToggleTurnOnTVClick(): void {
		getAudioElement().currentTime = 0;
		setShowInfo((currentValue) => {
			AnalyticsService.trackEvent("HOME|TV", { action: currentValue ? "TURN_OFF" : "TURN_ON" });
			return !currentValue;
		});
	}

	function onSongEndedHandler(): void {
		setShowInfo(false);
	}

	// utils
	function getAudioElement(): HTMLAudioElement {
		return document.getElementById("tv-audio") as HTMLAudioElement;
	}

	return (
		<Block
			className={classNames(
				styles["TV"],
				"tw-relative tw-mb-2 tw-flex tw-w-28 tw-max-w-full tw-items-stretch tw-bg-gradient-to-b tw-from-gray-500 tw-to-gray-700 tw-p-2 dark:tw-from-gray-200 dark:tw-to-gray-400",
			)}
		>
			<Block className="tw-relative tw-h-16 tw-w-16 tw-overflow-hidden">
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
							wrapperClassName="dfr-bg-color-gs-black tw-bg-opacity-70 tw-rounded-full tw-p-1"
							color="dfr-text-color-gs-white"
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

					<Link
						variant={Link.variant.SIMPLE}
						href={song.url}
						className="tw-inline-block"
						isExternalLink
					>
						<Icon
							icon={song.source === "youtube" ? Icon.icon.YOUTUBE : Icon.icon.SPOTIFY}
							size={12}
							wrapperClassName="tw-absolute tw-top-0.5 tw-right-0.5"
						/>
					</Link>
				</Block>

				<Block
					className={classNames(
						"tw-absolute tw-top-0 tw-left-0 tw-h-full tw-w-full tw-transition-transform dfr-bg-color-gs-black",
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
								className="tw-my-0.5 tw-rounded-sm tw-border-b tw-border-gray-400 tw-bg-transparent dark:tw-border-gray-500"
							/>
						);
					})}
				</Block>
				<Block className="tw-h-6 tw-w-6 tw-overflow-hidden tw-rounded-full tw-transition-transform dfr-bg-color-gs-black">
					{hasNotStartedTV ? (
						<Button
							className="tw-flex tw-h-full tw-w-full tw-items-center tw-justify-center"
							onClick={handleStartTVClick}
						>
							<Block className="tw-relative tw-h-2 tw-w-2 tw-animate-ping tw-rounded-full tw-bg-green-500" />
						</Button>
					) : (
						<Button
							className={classNames(
								"tw-h-full tw-w-full tw-transition-transform",
								showInfo && "tw-rotate-90",
							)}
							onClick={handleToggleTurnOnTVClick}
						>
							<Block
								className={classNames(
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

function Flowers(): T_ReactElement {
	return (
		<Block className="tw-relative tw-flex-shrink-0 tw-overflow-hidden">
			<Icon
				icon={Icon.icon.FLOWER_2}
				size={20}
				wrapperClassName="tw-absolute tw-top-7 tw-left-2 tw--rotate-12"
			/>
			<Icon
				icon={Icon.icon.FLOWER_3}
				size={48}
				wrapperClassName="tw-relative tw-top-0.5"
			/>
			<Icon
				icon={Icon.icon.FLOWER_1}
				size={20}
				wrapperClassName="tw-absolute tw-top-7 tw-right-2 tw-rotate-12"
			/>
		</Block>
	);
}

function Table(): T_ReactElement {
	return (
		<Block className="tw-relative tw-overflow-hidden tw-border-4 tw-border-b-0 tw-border-yellow-900">
			<Block className="tw-w-5/12 tw-border-r-4 tw-border-yellow-900 tw-pb-1">
				<Block className="tw-bg-yellow-900">
					<LinkItem
						label="resume"
						url={ROUTES.RESUME}
					/>
					<Space size={0.5} />
					<LinkItem
						label="blog"
						url={ROUTES.BLOG}
					/>
					<Space size={0.5} />
					<LinkItem
						label="music"
						url={ROUTES.MUSIC}
					/>
					<Space size={1} />
				</Block>
			</Block>
			<Block className="tw-absolute tw-bottom-0 tw-right-0">
				<Icon
					icon={Icon.icon.SOCCER}
					size={32}
					wrapperClassName="tw-relative tw-top-4 tw-left-12"
				/>
				<Icon
					icon={Icon.icon.GUITAR}
					size={56}
					wrapperClassName="tw-relative tw--rotate-45 tw-left-5 tw-top-0"
				/>
			</Block>
		</Block>
	);
}

type T_LinkItemProps = {
	label: string;
	url: string;
	className?: string;
};

function LinkItem({ label, url, className = "" }: T_LinkItemProps): T_ReactElement {
	// handlers
	function handleItemClick(): void {
		AnalyticsService.trackEvent("HOME|DESKTOP_LINK", { page: label });
	}

	return (
		<Link
			variant={Link.variant.SIMPLE}
			className={classNames(
				"tw-flex tw-flex-1 tw-items-center tw-bg-yellow-700 tw-px-2 tw-py-0.5 tw-text-xs tw-font-bold dfr-text-color-gs-white",
				className,
			)}
			href={url}
			onClick={handleItemClick}
		>
			<InlineText className="tw-mr-1 tw-inline-block tw-h-1 tw-w-1 tw-rounded-full tw-bg-yellow-400" />
			<InlineText>{label}</InlineText>
		</Link>
	);
}
