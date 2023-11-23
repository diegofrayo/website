import * as React from "react";

import { useAsync } from "../../hooks";
import { getErrorMessage } from "../../utils/misc";
import v from "../../v";

import type { T_GuitarFret, T_PlainChordDetails } from "../types";
import GuitarService from "../service";
import GuitarFret from "./GuitarFret";

type T_GuitarChordProps = {
	plainChord: T_PlainChordDetails;
};

function GuitarChord({ plainChord }: T_GuitarChordProps) {
	// --- HOOKS ---
	const { data: parsedChord, error } = useAsync("/chord", () =>
		GuitarService.parseChord(plainChord),
	);

	// --- STATES & REFS ---
	const chordContainerRef = React.useRef<HTMLDivElement>(null);

	if (error) {
		return (
			<strong className="tw-mt-2 tw-block tw-text-red-700">
				Syntax error: {getErrorMessage(error)}
			</strong>
		);
	}

	if (v.isUndefined(parsedChord)) {
		return null;
	}

	return (
		<article className="tw-max-w-full tw-text-center">
			<section
				className="tw-pb-2 "
				ref={chordContainerRef}
			>
				<h1 className="tw-mb-6 tw-truncate tw-text-center tw-text-2xl tw-font-bold">
					{parsedChord.name}
				</h1>

				<div className="tw-flex-no-wrap tw-inline-flex tw-max-w-full tw-items-end tw-overflow-x-auto tw-overflow-y-hidden">
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

						<div className="tw-relative tw--left-0.5 tw-top-6 tw-h-36 tw-w-3 tw-rounded-br-md tw-rounded-tr-md tw-bg-black" />
					</div>

					<GuitarFret
						variant={GuitarFret.variant.SKIPPED_GUITAR_STRINGS}
						touchedStrings={parsedChord.touchedStrings}
					/>
				</div>
			</section>
		</article>
	);
}

export default GuitarChord;
