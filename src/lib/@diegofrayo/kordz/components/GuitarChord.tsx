import * as React from "react";

import { downloadComponentAsImage } from "../../utils/browser";
import { getErrorMessage, safeAsync } from "../../utils/misc";
import v from "../../v";

import type { T_GuitarFret, T_PlainChordDetails } from "../types";
import GuitarService from "../service";
import GuitarFret from "./GuitarFret";

type T_GuitarChordProps = {
	plainChord: T_PlainChordDetails;
};

async function GuitarChord({ plainChord }: T_GuitarChordProps) {
	// --- STATES & REFS ---
	const chordContainerRef = React.useRef<HTMLDivElement>(null);

	// --- VARS ---
	const [parsedChord, error] = await safeAsync(() => GuitarService.parseChord(plainChord));

	// --- HANDLERS ---
	async function handleDownloadAsImageClick(): Promise<void> {
		if (v.isNull(chordContainerRef.current)) return;

		await downloadComponentAsImage(chordContainerRef.current, plainChord.name);

		// TODO
		// AnalyticsService.trackEvent("DOWNLOAD_CHORD_AS_IMAGE", {
		// 	chord: plainChord.name,
		// 	page: window.location.pathname,
		// });
	}

	if (error) {
		return (
			<strong className="tw-mt-2 tw-block tw-text-red-700 dark:tw-text-red-400">
				Syntax error: {getErrorMessage(error)}
			</strong>
		);
	}

	if (v.isUndefined(parsedChord)) {
		return null;
	}

	return (
		<article
			is="article"
			className="tw-max-w-full tw-text-center"
		>
			<section
				is="section"
				className="dark:dr-bg-color-primary tw-pb-2"
				ref={chordContainerRef}
			>
				<h1 className="tw-mb-4 tw-truncate tw-text-center">{parsedChord.name}</h1>

				<div className="tw-flex-no-wrap tw-inline-flex tw-max-w-full tw-items-end tw-overflow-x-auto">
					<GuitarFret variant={GuitarFret.variant.GUITAR_STRINGS_NAMES} />

					<div className="tw-flex-no-wrap tw-relative tw-inline-flex">
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

						<div className="dr-bg-color-bw dark:dr-bg-color-wb tw-relative tw--left-0.5 tw-top-6 tw-h-36 tw-w-3 tw-rounded-br-md tw-rounded-tr-md" />
					</div>

					<GuitarFret
						variant={GuitarFret.variant.SKIPPED_GUITAR_STRINGS}
						touchedStrings={parsedChord.touchedStrings}
					/>
				</div>
			</section>

			<div className="tw-text-sm">
				<div>
					<button
						type="button"
						onClick={handleDownloadAsImageClick}
					>
						<span className="tw-mr-2">⬇️</span>
						<span>descargar como imagen</span>
					</button>
				</div>
			</div>
		</article>
	);
}

export default GuitarChord;
