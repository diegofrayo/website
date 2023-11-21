import * as React from "react";
import { useRouter } from "next/router";

import { MainLayout, Page } from "~/components/layout";
import { Block, Button, Collapsible, Icon, Pre, Space, Text } from "~/components/primitive";
import { CopyToClipboardPopover, Loader } from "~/components/shared";
import { ClientRenderComponent } from "~/hocs";
import { ComponentWithAuth } from "~/modules/auth";
import { MDXContent } from "~/modules/mdx/client";
import { ROUTES } from "~/modules/routing";
import type { T_PageContent } from "~/server/data-loader";
import { KordzService, TextFormatter } from "@diegofrayo/kordz";
import { useBrowserStorageState } from "@diegofrayo/storage";
import type { T_Song } from "@diegofrayo/types/kordz";

import SongDetails from "../components/SongDetails";
import SongSources from "../components/SongSources";
import { isChordsSong } from "../utils";

export type T_SongPageProps = {
	cmsContent: T_PageContent;
	songDetails: T_Song;
	songContent: string;
};

function SongPage({ cmsContent, songDetails, songContent }: T_SongPageProps) {
	// --- HOOKS ---
	const router = useRouter();
	const [fontSize, setFontSize] = useBrowserStorageState({
		key: "DR_KORDZ_FONT_SIZE",
		value: 1,
		saveWhenCreating: true,
		readInitialValueFromStorage: true,
	});

	// --- VARS ---
	const isMaxFontSize = fontSize === 2;
	const isMinFontSize = fontSize === 0.6;

	// --- HANDLERS ---
	function handleIncreaseFontSizeClick() {
		setFontSize(Number((fontSize + 0.2).toFixed(2)));
	}

	function handleDecreaseFontSizeClick() {
		setFontSize(Number((fontSize - 0.2).toFixed(2)));
	}

	// --- UTILS ---
	function parseSEOItem(input: string) {
		return input.replace("{{title}}", songDetails.title).replace("{{artist}}", songDetails.artist);
	}

	function getCurrentHref() {
		return window.location.href;
	}

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
				title: isChordsSong(songDetails)
					? songDetails.title
					: parseSEOItem(cmsContent.content.seo.title),
				replaceTitle: !isChordsSong(songDetails),
				description: parseSEOItem(cmsContent.content.seo.description),
				pathname: `${ROUTES.KORDZ}/${songDetails.id}`,
				disableSEO: true,
				// disableSEO: songDetails.is_public === false, // TODO
			}}
		>
			<MainLayout title={songDetails.title}>
				<SongDetails song={songDetails} />
				<Space size={6} />

				<Block className="tw-border-4 dr-border-color-surface-300">
					<Block className="tw-flex tw-items-center tw-justify-center tw-gap-3 tw-p-4 tw-leading-0 dr-bg-color-surface-200">
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

						<CopyToClipboardPopover
							popoverText="url copied!"
							textToCopy={getCurrentHref}
						>
							<Button variant={Button.variant.SIMPLE}>
								<Icon
									icon={Icon.icon.LINK}
									size={24}
								/>
							</Button>
						</CopyToClipboardPopover>
					</Block>

					<Block className="tw-max-w-full tw-border-y-4 tw-p-4 dr-border-color-surface-300">
						<ClientRenderComponent>
							<Block
								className="tw-overflow-x-scroll tw-pb-1"
								style={{ fontSize: `${fontSize}rem` }}
							>
								<MDXContent
									code={songContent}
									globals={{ DATA: { song: songDetails } }}
									components={{ TextFormatter }}
								/>
							</Block>
						</ClientRenderComponent>
					</Block>

					<Block className="tw-p-4 tw-text-center dr-bg-color-surface-200">
						<Text className="tw-font-bold">Lista de acordes: [{songDetails.chords.length}]</Text>
						<Pre
							variant={Pre.variant.BREAK_WORDS}
							dangerouslySetInnerHTML={{
								__html: KordzService.parseMusicText(songDetails.chords.join(" | ")).parsedText,
							}}
						/>
					</Block>

					{songDetails.interpretation ? (
						<ComponentWithAuth className="tw-border-t-4 tw-p-4 dr-bg-color-surface-200 dr-border-color-surface-300">
							<Collapsible
								title="Interpretación"
								contentClassName="tw-italic"
							>
								<Pre variant={Pre.variant.BREAK_WITH_BLANK_LINES}>{songDetails.interpretation}</Pre>
							</Collapsible>
						</ComponentWithAuth>
					) : null}
				</Block>
				<Space size={2} />

				<SongSources sources={songDetails.sources} />
			</MainLayout>
		</Page>
	);
}

export default SongPage;
