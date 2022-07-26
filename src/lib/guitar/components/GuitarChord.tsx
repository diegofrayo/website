// @ts-nocheck

import * as React from "react";
import classNames from "classnames";

import { Button, Title, Block, InlineText } from "~/components/primitive";
import { Emoji } from "~/components/shared";
import { useExecuteCallback } from "~/hooks";
import AnalyticsService from "~/services/analytics";
import type { T_ReactElement, T_ReactRefObject } from "~/types";
import { downloadComponentAsImage, handleCopyToClipboardClick } from "~/utils/browser";

import GuitarFret from "./GuitarFret";
import GuitarService from "../service";
import { T_ParsedChord, T_GuitarFret, T_GuitarPlayedStrings, T_MusicNote } from "../types";

type T_GuitarChordProps = {
	name: string;
	musicNotes: T_MusicNote[] | string; // "STRING|BARRE,FRET,FINGER?"
	playedStrings?: T_GuitarPlayedStrings;
	enableShowNotesOption?: boolean;
};

function GuitarChord(props: T_GuitarChordProps): T_ReactElement {
	const {
		// props
		name,
		playedStrings,
		enableShowNotesOption,

		// states
		showChordInput,
		chordContainerRef,

		// handlers
		handleDownloadAsImage,
		handleShowChordInput,

		// vars
		error,
		data,
	} = useController(props);

	if (error) {
		return (
			<InlineText
				is="strong"
				className="tw-mt-2 tw-block tw-text-red-700 dark:tw-text-red-400"
			>
				Syntax error: {error.message}
			</InlineText>
		);
	}

	if (!data) {
		return null;
	}

	const { firstFret, lastFret, musicNotesAsString, groupedMusicNotesByGuitarFret } = data;

	return (
		<Block
			is="article"
			className="tw-max-w-full tw-text-center"
		>
			<Block
				is="section"
				className="tw-pb-2 dark:dfr-bg-color-primary"
				ref={chordContainerRef}
			>
				<Title
					is="h1"
					variant={Title.variant.SECONDARY}
					className="tw-mb-4 tw-truncate tw-text-center"
					size={Title.size.MD}
				>
					{name}
				</Title>

				<Block className="tw-flex-no-wrap tw-inline-flex tw-max-w-full tw-items-end tw-overflow-x-auto">
					<GuitarFret variant={GuitarFret.variant.STRINGS_NAMES} />

					<Block className="tw-flex-no-wrap tw-relative tw-inline-flex">
						<GuitarFret
							variant={GuitarFret.variant.EMPTY}
							number={(lastFret + 1) as T_GuitarFret}
						/>

						{Object.entries(groupedMusicNotesByGuitarFret)
							.reverse()
							.map(([fret, musicNotes]: [string, T_MusicNote[]]) => {
								return (
									<GuitarFret
										key={`${fret}`}
										variant={GuitarFret.variant.DEFAULT}
										number={Number(fret) as T_GuitarFret}
										musicNotes={musicNotes}
									/>
								);
							})}

						{firstFret > 1 && (
							<GuitarFret
								variant={GuitarFret.variant.EMPTY}
								number={1}
							/>
						)}

						<Block className="tw-relative tw-top-6 tw--left-0.5 tw-h-36 tw-w-3 tw-rounded-tr-md tw-rounded-br-md dfr-bg-color-bw dark:dfr-bg-color-wb" />
					</Block>

					{playedStrings && (
						<GuitarFret
							variant={GuitarFret.variant.SKIPPED_STRINGS}
							playedStrings={playedStrings}
						/>
					)}
				</Block>
			</Block>

			<Block className="tw-text-sm">
				<Block>
					<Button
						variant={Button.variant.DEFAULT}
						onClick={handleDownloadAsImage}
					>
						<Emoji className="tw-mr-2">⬇️</Emoji>
						<InlineText>descargar como imagen</InlineText>
					</Button>

					{musicNotesAsString && enableShowNotesOption ? (
						<Button
							variant={Button.variant.DEFAULT}
							className="tw-mt-1 tw-ml-0 sm:tw-ml-3 sm:tw-mt-0"
							onClick={handleShowChordInput}
						>
							<InlineText
								className={classNames(
									"tw-inline-block tw-w-4 tw-transition-all",
									showChordInput && "tw-rotate-90",
								)}
							>
								‣
							</InlineText>
							<InlineText>{showChordInput ? "ocultar" : "mostrar"} notas</InlineText>
						</Button>
					) : null}
				</Block>

				{showChordInput && (
					<Block className="tw-mt-3 tw-text-center tw-text-sm">
						<Pre
							variant={Pre.variant.VARIANTS.BREAK_WORDS}
							className="tw-inline-block tw-border tw-p-2 dfr-border-color-primary"
						>
							<Button
								variant={Button.variant.SIMPLE}
								data-clipboard-text={musicNotesAsString}
								onClick={handleCopyToClipboardClick}
							>
								<Emoji>📋</Emoji>
							</Button>{" "}
							{musicNotesAsString}
						</Pre>
					</Block>
				)}
			</Block>
		</Block>
	);
}

export default GuitarChord;

// --- Controller ---

function useController({
	name,
	musicNotes,
	playedStrings,
	enableShowNotesOption = false,
}: T_GuitarChordProps): Pick<
	T_GuitarChordProps,
	"name" | "playedStrings" | "enableShowNotesOption"
> & {
	// states
	showChordInput: boolean;
	chordContainerRef: T_ReactRefObject<HTMLDivElement>;

	// handlers
	handleDownloadAsImage: () => void;
	handleShowChordInput: () => void;

	// vars
	data: T_ParsedChord;
	error: Error | undefined;
} {
	const { data, error } = useExecuteCallback(musicNotes, (params) => {
		return GuitarService.buildChord(params);
	});

	const chordContainerRef = React.useRef<HTMLDivElement>(null);
	const [showChordInput, setChordInput] = React.useState(false);

	async function handleDownloadAsImage(): Promise<void> {
		await downloadComponentAsImage(chordContainerRef.current, name);

		AnalyticsService.trackEvent("DOWNLOAD_CHORD_AS_IMAGE", {
			chord: name,
			page: window.location.pathname,
		});
	}

	function handleShowChordInput(): void {
		setChordInput((cs) => !cs);
	}

	return {
		// props
		name,
		enableShowNotesOption,
		playedStrings: [
			...(typeof playedStrings === "string" ? playedStrings.split(",") : playedStrings || []),
		].reverse(),

		// states
		showChordInput,
		chordContainerRef,

		// handlers
		handleDownloadAsImage,
		handleShowChordInput,

		// vars
		data,
		error,
	};
}
