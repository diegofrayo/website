import classNames from "classnames";
import * as React from "react";

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
import { Emoji } from "~/components/shared";
import { useTranslation } from "~/i18n";
import AnalyticsService from "~/services/analytics";
import { createArray } from "~/utils/objects-and-arrays";
import { ROUTES } from "~/utils/routing";
import { generateSlug } from "~/utils/strings";
import type { T_ReactElement, T_ReactElementNullable } from "~/types";

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

	// render
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

	// render
	return (
		<Block
			is="section"
			className="tw-relative tw-rounded-t-md tw-border-8 tw-border-yellow-700 tw-bg-green-700 tw-p-4 dfr-shadow"
		>
			<Emoji className="tw-absolute tw--top-4 tw--left-4 tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-full tw-text-sm dfr-shadow dfr-bg-color-light-strong">
				📌
			</Emoji>
			<Title
				is="h1"
				variant={Title.variant.UNSTYLED}
				className="tw-text-center dfr-text-color-light-strong"
				size={Title.size.MD}
			>
				FEATURED
			</Title>
			<Space size={2} />
			<Block>
				{content.map((item, index) => {
					return (
						<Link
							key={generateSlug(item.text)}
							variant={Link.variant.SIMPLE}
							href={item.url}
							className={classNames(
								"tw-mb-3 tw-block tw-text-sm tw-text-yellow-300 last:tw-mb-0",
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
	);
}

type T_RoomProps = {
	tvSong: T_HomeProps["data"]["song"];
	frameImage: T_HomeProps["data"]["photo"];
};

function Room({ tvSong, frameImage }: T_RoomProps): T_ReactElement {
	return (
		<Block
			className="tw-border-b-4 tw-px-8 tw-pt-16 dfr-border-color-dark-strong dfr-bg-color-light-strong sm:tw-px-10"
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

	// render
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
				<Image
					src={photo.src}
					className="tw-block tw-h-full tw-w-full tw-overflow-hidden tw-rounded-md tw-border-2 tw-border-yellow-700 dfr-transition-opacity"
					alt="Photography taken by Diego Rayo"
					onClick={handleImageClick}
				/>
			</Block>
			<Text className="tw-mx-auto tw-h-4 tw-w-16 tw-rounded-bl-md tw-rounded-br-md tw-border-2 tw-border-t-0 tw-border-yellow-700 tw-text-center tw-text-xxs tw-font-bold tw-italic dfr-text-color-dark-strong dfr-bg-color-light-strong dark:dfr-text-color-light-strong">
				{t("layout:header:room:welcome")}
			</Text>

			<style jsx>
				{`
					:global(.dfr-PictureFrame)::before,
					:global(.dfr-PictureFrame)::after {
						@apply dfr-bg-color-dark-strong;
						content: " ";
						display: block;
						height: 50px;
						position: absolute;
						top: -40px;
						width: 2.5px;
						z-index: -1;
					}

					:global(.tw-dark) :global(.dfr-PictureFrame)::before,
					:global(.tw-dark) :global(.dfr-PictureFrame)::after {
						@apply dfr-bg-color-light-strong;
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

	// render
	return (
		<Block className="dfr-TV tw-relative tw-mb-2 tw-flex tw-w-28 tw-max-w-full tw-items-stretch tw-bg-gradient-to-b tw-from-gray-800 tw-to-black tw-p-2 dark:tw-from-white dark:tw-to-gray-300">
			<Block className="tw-relative tw-h-16 tw-w-16 tw-overflow-hidden">
				<Block
					className="tw-relative tw-flex tw-h-full tw-items-center tw-justify-center tw-border tw-border-opacity-80 tw-bg-cover dfr-border-color-dark-strong dark:tw-border-opacity-10"
					title={`${song.title} - ${song.artist}`}
					style={{ backgroundImage: `url(${song.thumbnail})` }}
				>
					<Button
						variant={Button.variant.SIMPLE}
						onClick={handlePlayAndPauseClick}
					>
						<Icon
							icon={isAudioPlaying ? Icon.icon.PAUSE : Icon.icon.PLAY}
							size={28}
							wrapperClassName="dfr-bg-color-dark-strong tw-bg-opacity-70 tw-rounded-full"
							iconClassName="dfr-text-color-light-strong"
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

					<Icon
						icon={song.source === "youtube" ? Icon.icon.YOUTUBE : Icon.icon.SPOTIFY}
						size={12}
						wrapperClassName="tw-absolute tw-top-0.5 tw-right-0.5"
					/>
				</Block>

				<Block
					className={classNames(
						"tw-absolute tw-top-0 tw-left-0 tw-h-full tw-w-full tw-transition-transform dfr-bg-color-dark-strong",
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
								key={generateSlug(`TV-Block-${i}`)}
								className="tw-my-0.5 tw-rounded-sm tw-border-b tw-border-gray-600 dark:dfr-border-color-dark-strong"
							/>
						);
					})}
				</Block>
				<Block className="tw-h-6 tw-w-6 tw-overflow-hidden tw-rounded-full tw-bg-gray-700 tw-transition-transform dark:dfr-bg-color-dark-strong">
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

			<style jsx>
				{`
					:global(.dfr-TV)::before,
					:global(.dfr-TV)::after {
						@apply dfr-bg-color-dark-strong;
						@apply tw-w-2;
						@apply tw-h-6;
						content: " ";
						display: block;
						position: absolute;
						top: 90%;
						z-index: 0;
					}

					:global(.tw-dark) :global(.dfr-TV)::before,
					:global(.tw-dark) :global(.dfr-TV)::after {
						@apply tw-bg-gray-300;
					}

					:global(.dfr-TV)::before {
						transform: rotate(45deg);
						left: 15%;
					}

					:global(.dfr-TV)::after {
						transform: rotate(-45deg);
						right: 15%;
					}
				`}
			</style>
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
						label="about me"
						url={ROUTES.ABOUT_ME}
					/>
					<Space size={0.5} />
					<LinkItem
						label="resume"
						url={ROUTES.RESUME}
					/>
					<Space size={0.5} />
					<LinkItem
						label="blog"
						url={ROUTES.BLOG}
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
		AnalyticsService.trackEvent("HOME|DESKTOP", { page: label });
	}

	// render
	return (
		<Link
			variant={Link.variant.SECONDARY}
			className={classNames(
				"tw-flex tw-flex-1 tw-items-center tw-bg-yellow-700 tw-px-2 tw-py-0.5 tw-text-xs dfr-text-color-light-strong",
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
