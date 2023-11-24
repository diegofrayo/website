import * as React from "react";
import { useRouter } from "next/router";
import cn from "classnames";

import { MainLayout, Page } from "~/components/layout";
import {
	Block,
	Button,
	Collapsible,
	Icon,
	InlineText,
	Modal,
	Pre,
	Space,
	Text,
} from "~/components/primitive";
import { CopyToClipboardPopover, Loader } from "~/components/shared";
import { ClientRenderComponent } from "~/hocs";
import { ComponentWithAuth } from "~/modules/auth";
import { MDXContent } from "~/modules/mdx/client";
import { ROUTES } from "~/modules/routing";
import type { T_PageContent } from "~/server/data-loader";
import { useDidMount } from "@diegofrayo/hooks";
import { KordzService, TextFormatter, GuitarChord, type T_PlainChord } from "@diegofrayo/kordz";
import { useBrowserStorageState } from "@diegofrayo/storage";
import type { T_Song } from "@diegofrayo/types/kordz";
import { createArray } from "@diegofrayo/utils/arrays-and-objects";
import { generateSlug } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";

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

	// --- STATES & REFS ---
	const [isModalVisible, setIsModalVisible] = React.useState(false);
	const [selectedUnparsedChord, setSelectedUnparsedChord] = React.useState<
		T_PlainChord | undefined
	>(undefined);
	const [selectedUnparsedChordIndex, setSelectedUnparsedChordIndex] = React.useState(0);

	// --- VARS ---
	const isMaxFontSize = fontSize === 2;
	const isMinFontSize = fontSize === 0.6;

	// --- EFFECTS ---
	useDidMount(() => {
		window.addEventListener("KORDZ_CHORD_SELECTED", (event: Event) => {
			if ("detail" in event) {
				const { chord, selectedChordIndex } = event.detail as {
					chord: T_PlainChord;
					selectedChordIndex: number;
				};

				if (v.notFound(chord)) {
					// showAlert(`"${target.innerText}" details not found`); // TODO
					return;
				}

				setSelectedUnparsedChord(chord);
				setSelectedUnparsedChordIndex(selectedChordIndex);
				setIsModalVisible(true);
			}
		});
	});

	// --- HANDLERS ---
	function onModalCloseHandler() {
		setIsModalVisible(false);
		setSelectedUnparsedChord(undefined);
	}

	function handleUpdateSelectedUnparsedChordVariantClick(value: string | number) {
		return () => {
			if (v.isNumber(value)) {
				setSelectedUnparsedChordIndex(value);
				return;
			}

			const operator = 1 * (value === "+" ? 1 : -1);

			if (selectedUnparsedChordIndex + operator < 0) {
				setSelectedUnparsedChordIndex((selectedUnparsedChord as T_PlainChord[]).length - 1);
			} else if (
				selectedUnparsedChordIndex + operator >
				(selectedUnparsedChord as T_PlainChord[]).length - 1
			) {
				setSelectedUnparsedChordIndex(0);
			} else {
				setSelectedUnparsedChordIndex(selectedUnparsedChordIndex + operator);
			}
		};
	}

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
							<Collapsible title="Interpretación">
								<Pre
									variant={Pre.variant.BREAK_WITH_BLANK_LINES}
									className="tw-text-sm"
								>
									{songDetails.interpretation}
								</Pre>
							</Collapsible>
						</ComponentWithAuth>
					) : null}
				</Block>
				<Space size={2} />

				<SongSources sources={songDetails.sources} />

				<ChordModal
					isModalVisible={isModalVisible}
					onModalCloseHandler={onModalCloseHandler}
					selectedUnparsedChord={selectedUnparsedChord}
					selectedUnparsedChordIndex={selectedUnparsedChordIndex}
					handleUpdateSelectedUnparsedChordVariantClick={
						handleUpdateSelectedUnparsedChordVariantClick
					}
				/>
			</MainLayout>
		</Page>
	);
}

export default SongPage;

// --- COMPONENTS ---

type T_ChordModalProps = {
	isModalVisible: boolean;
	selectedUnparsedChord: T_PlainChord | undefined;
	selectedUnparsedChordIndex: number;
	handleUpdateSelectedUnparsedChordVariantClick: (input: number | "+" | "-") => () => void;
	onModalCloseHandler: () => void;
};

function ChordModal({
	isModalVisible,
	onModalCloseHandler,
	selectedUnparsedChord,
	selectedUnparsedChordIndex,
	handleUpdateSelectedUnparsedChordVariantClick,
}: T_ChordModalProps) {
	return (
		<Modal
			visible={isModalVisible}
			onCloseHandler={onModalCloseHandler}
		>
			<Block className="tw-relative tw-w-96 tw-max-w-full tw-border-4 tw-p-4 tw-pb-6 dr-bg-color-surface-200 dr-border-color-surface-300">
				<Button
					variant={Button.variant.SIMPLE}
					className="tw-absolute tw-right-2 tw-top-2 tw-block tw-text-center tw-leading-0"
					onClick={onModalCloseHandler}
				>
					<Icon
						icon={Icon.icon.X}
						size={24}
					/>
				</Button>

				{Array.isArray(selectedUnparsedChord) ? (
					<Block>
						{selectedUnparsedChord.map((chord, index) => {
							return (
								<Block
									key={generateSlug(`${chord.name}-${index}`)}
									className={cn(index === selectedUnparsedChordIndex ? "tw-block" : "tw-hidden")}
								>
									<GuitarChord plainChord={chord} />
								</Block>
							);
						})}
						<Space size={1} />

						<Block className="tw-flex tw-items-center tw-justify-center">
							<Button
								variant={Button.variant.SIMPLE}
								className="tw-relative tw-top-px"
								onClick={handleUpdateSelectedUnparsedChordVariantClick("-")}
							>
								<Icon
									icon={Icon.icon.CHEVRON_LEFT}
									size={20}
								/>
							</Button>
							<Block className="tw-mx-3">
								{createArray(selectedUnparsedChord.length, 0).map((index) => {
									return (
										<InlineText
											key={generateSlug(`TextFormatter-InlineText-index-${index}`)}
											className={cn(
												"tw-mx-1 tw-inline-flex tw-cursor-pointer tw-items-center tw-justify-center tw-rounded-full tw-border tw-text-xs tw-leading-0 tw-wh-5",
												selectedUnparsedChordIndex === index
													? "tw-bg-white tw-font-bold tw-text-black dr-border-color-surface-300"
													: "tw-text-white dr-bg-color-surface-300 dr-border-color-surface-400",
											)}
											onClick={handleUpdateSelectedUnparsedChordVariantClick(index)}
										>
											{index + 1}
										</InlineText>
									);
								})}
							</Block>
							<Button
								variant={Button.variant.SIMPLE}
								className="tw-relative tw-top-px"
								onClick={handleUpdateSelectedUnparsedChordVariantClick("+")}
							>
								<Icon
									icon={Icon.icon.CHEVRON_RIGHT}
									size={20}
								/>
							</Button>
						</Block>
					</Block>
				) : selectedUnparsedChord ? (
					<GuitarChord plainChord={selectedUnparsedChord} />
				) : null}
			</Block>
		</Modal>
	);
}
