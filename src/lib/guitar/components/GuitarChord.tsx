import * as React from "react";

import { Button, Title, Block, InlineText } from "~/components/primitive";
import { Emoji } from "~/components/shared";
import { AnalyticsService } from "~/features/analytics";
import { useExecuteCallback } from "~/hooks";
import { downloadComponentAsImage } from "~/utils/browser";
import { getErrorMessage } from "~/utils/misc";
import { isNull, isUndefined } from "~/utils/validations";
import type { T_ReactElementNullable, T_ReactRefObject } from "~/types";

import GuitarFret from "./GuitarFret";
import GuitarService from "../service";
import { T_ParsedChord, T_GuitarFret, T_MusicNote, T_PreparsedChordDetails } from "../types";

// WARN: False positive
/* eslint-disable react/no-unused-prop-types */
type T_GuitarChordProps = { chord: T_PreparsedChordDetails };

function GuitarChord(props: T_GuitarChordProps): T_ReactElementNullable {
	const {
		// props
		chord,

		// states && refs
		chordContainerRef,

		// handlers
		handleDownloadAsImageClick,

		// vars
		data,
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

	if (isUndefined(data)) {
		return null;
	}

	const { firstFret, lastFret, musicNotesGroupedByGuitarFret } = data;

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
					{chord.name}
				</Title>

				<Block className="tw-flex-no-wrap tw-inline-flex tw-max-w-full tw-items-end tw-overflow-x-auto">
					<GuitarFret variant={GuitarFret.variant.GUITAR_STRINGS_NAMES} />

					<Block className="tw-flex-no-wrap tw-relative tw-inline-flex">
						<GuitarFret
							variant={GuitarFret.variant.EMPTY}
							number={(lastFret + 1) as T_GuitarFret}
						/>

						{Object.entries(musicNotesGroupedByGuitarFret)
							.reverse()
							.map(([fret, musicNotes]: [string, T_MusicNote[]]) => {
								return (
									<GuitarFret
										key={`${fret}`}
										variant={GuitarFret.variant.DEFAULT}
										number={Number(fret) as T_GuitarFret}
										musicNotes={musicNotes}
										isBarreFret={(Number(fret) as T_GuitarFret) === data.barreFret}
									/>
								);
							})}

						{firstFret > 1 ? (
							<GuitarFret
								variant={GuitarFret.variant.EMPTY}
								number={1}
							/>
						) : null}

						<Block className="tw-relative tw-top-6 tw--left-0.5 tw-h-36 tw-w-3 tw-rounded-tr-md tw-rounded-br-md dfr-bg-color-bw dark:dfr-bg-color-wb" />
					</Block>

					<GuitarFret
						variant={GuitarFret.variant.SKIPPED_GUITAR_STRINGS}
						touchedStrings={chord.touchedStrings}
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

type T_UseControllerReturn = T_GuitarChordProps & {
	chordContainerRef: T_ReactRefObject<HTMLDivElement>;
	handleDownloadAsImageClick: () => Promise<void>;
	data: T_ParsedChord | undefined;
	error: unknown;
};

function useController({ chord }: T_GuitarChordProps): T_UseControllerReturn {
	// hooks
	const { data, error } = useExecuteCallback<string, T_ParsedChord>(chord.musicNotes, (params) => {
		return GuitarService.parseChord(params);
	});

	// states & refs
	const chordContainerRef = React.useRef<HTMLDivElement>(null);

	// handlers
	async function handleDownloadAsImageClick(): Promise<void> {
		if (isNull(chordContainerRef.current)) return;

		await downloadComponentAsImage(chordContainerRef.current, chord.name);

		AnalyticsService.trackEvent("DOWNLOAD_CHORD_AS_IMAGE", {
			chord: chord.name,
			page: window.location.pathname,
		});
	}

	return {
		// props
		chord,

		// states && refs
		chordContainerRef,

		// handlers
		handleDownloadAsImageClick,

		// vars
		data,
		error,
	};
}
