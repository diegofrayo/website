import * as React from "react";
import { useRouter } from "next/router";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import { Icon, Button, Space, Block, Text, Pre, Collapsible } from "~/components/primitive";
import { Page, MainLayout } from "~/components/layout";
import { MDXContent, Loader, RateContent, ProtectedComponent } from "~/components/shared";
import { useTranslation } from "~/features/i18n";
import { ROUTES } from "~/features/routing";
import { useDidMount } from "~/hooks";
import { GuitarService } from "~/lib/guitar";
import v from "~/lib/v";
import { copyToClipboard } from "~/utils/browser";
import { safeCastNumber } from "~/utils/numbers";
import type { T_ReactElement } from "~/types";

import { SongDetails, SongSources } from "../components";
import MusicService, { T_Song } from "../service";

// WARN: False positive
/* eslint-disable react/no-unused-prop-types */
type T_PageProps = {
	song: T_Song;
	songMDXContent: MDXRemoteSerializeResult;
};

function SongPage(props: T_PageProps): T_ReactElement {
	// hooks
	const router = useRouter();
	const { t } = useTranslation();
	const {
		// props
		song,
		songMDXContent,

		// states & refs
		fontSize,

		// handlers
		handleIncreaseFontSizeClick,
		handleDecreaseFontSizeClick,
		handleCopyUrlClick,

		// vars
		isMaxFontSize,
		isMinFontSize,
	} = useController(props);

	if (router.isFallback) {
		return (
			<Block className="tw-p-4 tw-text-center">
				<Loader />
			</Block>
		);
	}

	return (
		<Page
			config={{
				title: MusicService.isChordsSong(song)
					? song.title
					: t("seo:title", { title: song.title, artist: song.artist }),
				replaceTitle: !MusicService.isChordsSong(song),
				description: t("seo:description", { title: song.title, artist: song.artist }),
				pathname: `${ROUTES.MUSIC}/${song.id}`,
				disableSEO: v.isNotTrue(song.isPublic),
			}}
		>
			<MainLayout
				title={song.title}
				width="tw-max-w-[1024px]"
			>
				<SongDetails song={song} />
				<Space size={6} />

				<Block className="tw-border-4 dfr-border-color-primary">
					<Block className="tw-p-4 tw-text-center tw-leading-0 dfr-bg-color-secondary">
						<Button
							variant={Button.variant.SIMPLE}
							disabled={isMaxFontSize}
							onClick={handleIncreaseFontSizeClick}
						>
							<Icon
								icon={Icon.icon.ZOOM_IN}
								size={24}
							/>
						</Button>
						<Space
							size={1}
							orientation="v"
						/>
						<Button
							variant={Button.variant.SIMPLE}
							disabled={isMinFontSize}
							onClick={handleDecreaseFontSizeClick}
						>
							<Icon
								icon={Icon.icon.ZOOM_OUT}
								size={24}
							/>
						</Button>
						<Space
							size={1}
							orientation="v"
						/>
						<Button
							variant={Button.variant.SIMPLE}
							onClick={handleCopyUrlClick}
						>
							<Icon
								icon={Icon.icon.LINK}
								size={24}
							/>
						</Button>
					</Block>

					<Block className="tw-max-w-full tw-border-y-4 tw-p-4 dfr-border-color-primary">
						<Block
							className="tw-overflow-x-scroll tw-pb-1"
							style={{ fontSize: `${fontSize}rem` }}
						>
							<MDXContent
								content={songMDXContent}
								variant={MDXContent.variant.UNSTYLED}
							/>
						</Block>
					</Block>

					<Block className="tw-p-4 tw-text-center dfr-bg-color-secondary">
						<Text className="tw-font-bold">
							{t("page:chords_title")} [{song.chords.length}]
						</Text>
						<Pre
							variant={Pre.variant.BREAK_WORDS}
							dangerouslySetInnerHTML={{
								__html: GuitarService.parseMusicText(song.chords.join(" | ")).parsedText,
							}}
						/>
					</Block>
					{song.interpretation ? (
						<ProtectedComponent className="tw-border-t-4 tw-p-4 dfr-bg-color-secondary">
							<Collapsible
								title="Interpretación"
								contentClassName="tw-italic dfr-text-color-secondary"
							>
								<Pre variant={Pre.variant.BREAK_WITH_BLANK_LINES}>{song.interpretation}</Pre>
							</Collapsible>
						</ProtectedComponent>
					) : null}
				</Block>
				<Space size={2} />

				<SongSources sources={song.sources} />
				<Space size={8} />

				<RateContent />
			</MainLayout>
		</Page>
	);
}

export default SongPage;

// --- Controller ---

type T_UseControllerReturn = {
	song: T_PageProps["song"];
	fontSize: number;
	songMDXContent: MDXRemoteSerializeResult;
	isMaxFontSize: boolean;
	isMinFontSize: boolean;
	handleIncreaseFontSizeClick: () => void;
	handleDecreaseFontSizeClick: () => void;
	handleCopyUrlClick: () => void;
};

function useController({ songMDXContent, song }: T_PageProps): T_UseControllerReturn {
	// states & refs
	const [fontSize, setFontSize] = React.useState(0);

	// vars
	const LOCAL_STORAGE_KEY = "DFR_MUSIC_FONT_SIZE";

	// effects
	useDidMount(() => {
		setFontSize(getFontSize());
	});

	React.useEffect(
		function updateFontSizeOnLocalStorage() {
			window.localStorage.setItem(LOCAL_STORAGE_KEY, `${fontSize}`);
		},
		[fontSize],
	);

	// handlers
	function handleIncreaseFontSizeClick(): void {
		setFontSize((currentValue) => Number((currentValue + 0.2).toFixed(1)));
	}

	function handleDecreaseFontSizeClick(): void {
		setFontSize((currentValue) => Number((currentValue - 0.2).toFixed(1)));
	}

	function handleCopyUrlClick(): void {
		copyToClipboard(window.location.href);
	}

	// utils
	function getFontSize(): number {
		const INITIAL_VALUE = 0.8;
		const readedFontSize = safeCastNumber(
			window.localStorage.getItem(LOCAL_STORAGE_KEY) || "0",
			NaN,
		);

		if (Number.isNaN(readedFontSize) || readedFontSize === 0) {
			return INITIAL_VALUE;
		}

		return readedFontSize;
	}

	return {
		// props
		song,
		songMDXContent,

		// states & refs
		fontSize,

		// handlers
		handleIncreaseFontSizeClick,
		handleDecreaseFontSizeClick,
		handleCopyUrlClick,

		// vars
		isMaxFontSize: fontSize === 2,
		isMinFontSize: fontSize === 0.6,
	};
}
