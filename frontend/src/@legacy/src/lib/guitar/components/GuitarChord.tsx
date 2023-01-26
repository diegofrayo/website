import * as React from "react";

import { Button, Title, Block, InlineText } from "~/@legacy/src/components/primitive";
import { Emoji } from "~/@legacy/src/components/shared";
import { AnalyticsService } from "~/@legacy/src/features/analytics";
import { useAsync } from "~/@legacy/src/hooks";
import v from "~/@legacy/src/lib/v";
import { downloadComponentAsImage } from "~/@legacy/src/utils/browser";
import { getErrorMessage } from "~/@legacy/src/utils/misc";
import type { T_ReactElementNullable, T_ReactRef } from "~/@legacy/src/types";

import GuitarFret from "./GuitarFret";
import GuitarService from "../service";
import type { T_GuitarFret, T_Chord, T_PlainChordDetails } from "../types";

// WARN: False positive
/* eslint-disable react/no-unused-prop-types */
type T_GuitarChordProps = { plainChord: T_PlainChordDetails };

function GuitarChord(props: T_GuitarChordProps): T_ReactElementNullable {
	const {
		// states && refs
		chordContainerRef,

		// handlers
		handleDownloadAsImageClick,

		// vars
		parsedChord,
		error,
	} = useController(props);

	if (error) {
		return (
			<InlineText
				is="strong"
				className="tw-mt-2 tw-block tw-text-red-700 dark:tw-text-red-400"
			>
				Syntax error: {getErrorMessage(error)}
			</InlineText>
		);
	}

	if (v.isUndefined(parsedChord)) {
		return null;
	}

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
					{parsedChord.name}
				</Title>

				<Block className="tw-flex-no-wrap tw-inline-flex tw-max-w-full tw-items-end tw-overflow-x-auto">
					<GuitarFret variant={GuitarFret.variant.GUITAR_STRINGS_NAMES} />

					<Block className="tw-flex-no-wrap tw-relative tw-inline-flex">
						<GuitarFret
							variant={GuitarFret.variant.EMPTY}
							number={(parsedChord.lastFret + 1) as T_GuitarFret}
						/>

						{Object.entries(parsedChord.musicNotesGroupedByFret)
							.reverse()
							.map(([fretKey, musicNotes]) => {
								const fret = Number(fretKey) as T_GuitarFret;

								return (
									<GuitarFret
										key={`${fret}`}
										variant={GuitarFret.variant.DEFAULT}
										number={fret}
										musicNotes={musicNotes}
										barreFret={
											parsedChord.barreFret?.fret === fret ? parsedChord.barreFret : undefined
										}
									/>
								);
							})}

						{parsedChord.firstFret > 1 ? (
							<GuitarFret
								variant={GuitarFret.variant.EMPTY}
								number={1}
							/>
						) : null}

						<Block className="tw-relative tw-top-6 tw--left-0.5 tw-h-36 tw-w-3 tw-rounded-tr-md tw-rounded-br-md dfr-bg-color-bw dark:dfr-bg-color-wb" />
					</Block>

					<GuitarFret
						variant={GuitarFret.variant.SKIPPED_GUITAR_STRINGS}
						touchedStrings={parsedChord.touchedStrings}
					/>
				</Block>
			</Block>

			<Block className="tw-text-sm">
				<Block>
					<Button
						variant={Button.variant.DEFAULT}
						onClick={handleDownloadAsImageClick}
					>
						<Emoji className="tw-mr-2">⬇️</Emoji>
						<InlineText>descargar como imagen</InlineText>
					</Button>
				</Block>
			</Block>
		</Block>
	);
}

export default GuitarChord;

// --- Controller ---

type T_UseControllerReturn = {
	chordContainerRef: T_ReactRef<HTMLDivElement>;
	handleDownloadAsImageClick: () => Promise<void>;
	parsedChord: T_Chord | undefined;
	error: unknown;
};

function useController({ plainChord }: T_GuitarChordProps): T_UseControllerReturn {
	// hooks
	const { data, error } = useAsync<T_PlainChordDetails, T_Chord>(plainChord, (params) => {
		return GuitarService.parseChord(params);
	});

	// states & refs
	const chordContainerRef = React.useRef<HTMLDivElement>(null);

	// handlers
	async function handleDownloadAsImageClick(): Promise<void> {
		if (v.isNull(chordContainerRef.current)) return;

		await downloadComponentAsImage(chordContainerRef.current, plainChord.name);

		AnalyticsService.trackEvent("DOWNLOAD_CHORD_AS_IMAGE", {
			chord: plainChord.name,
			page: window.location.pathname,
		});
	}

	return {
		// states && refs
		chordContainerRef,

		// handlers
		handleDownloadAsImageClick,

		// vars
		parsedChord: data,
		error,
	};
}
