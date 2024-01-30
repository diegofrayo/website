import * as React from "react";
import cn from "classnames";

import twcss from "../../twcss";
import { createArray, mirror } from "../../utils/arrays-and-objects";
import v from "../../v";

import { NUMBER_OF_STRINGS } from "../utils";
import type { T_MusicNote, T_GuitarFret, T_GuitarString, T_Chord } from "../types";

const VARIANTS = mirror(["GUITAR_STRINGS_NAMES", "EMPTY", "DEFAULT", "SKIPPED_GUITAR_STRINGS"]);
type T_Variant = keyof typeof VARIANTS;
type T_GuitarFretProps = {
	variant: T_Variant;
	number?: T_GuitarFret;
	musicNotes?: T_MusicNote[];
	barreFret?: T_Chord["barreFret"];
	touchedStrings?: T_Chord["touchedStrings"];
};

function GuitarFret({ variant, number, musicNotes, touchedStrings, barreFret }: T_GuitarFretProps) {
	// --- VARS ---
	const GUITAR_STRINGS_NAMES = ["E", "A", "D", "G", "B", "E"].reverse();
	const isDefaultVariant = variant === VARIANTS.DEFAULT;
	const isEmptyVariant = variant === VARIANTS.EMPTY;
	const isSkippedGuitarStringsVariant = variant === VARIANTS.SKIPPED_GUITAR_STRINGS;
	const isGuitarStringsNamesVariant = variant === VARIANTS.GUITAR_STRINGS_NAMES;

	// --- UTILS ---
	function isBarreFretChecker(input: unknown): input is NonNullable<T_Chord["barreFret"]> {
		return input !== undefined;
	}

	return (
		<div
			className={cn(
				"tw-flex-shrink-0 tw-text-xs",
				isSkippedGuitarStringsVariant
					? "tw-w-auto"
					: isGuitarStringsNamesVariant
					? "tw-w-16"
					: "tw-w-10",
			)}
		>
			{isEmptyVariant || isDefaultVariant ? (
				<div className="tw-flex tw-h-6 tw-items-center tw-justify-center tw-text-base tw-font-bold">
					{number}
				</div>
			) : null}

			<div
				className={cn(
					(isEmptyVariant || isDefaultVariant) &&
						"tw-border-l-4 tw-border-yellow-400 tw-bg-yellow-700",
				)}
			>
				{(createArray(NUMBER_OF_STRINGS).reverse() as T_GuitarString[]).map((guitarString) => {
					if (isGuitarStringsNamesVariant) {
						return (
							<div
								key={`guitarString-${guitarString}`}
								className="tw-flex tw-h-6 tw-items-center"
							>
								<div className="tw-flex tw-w-full tw-justify-end tw-px-1 tw-text-base">
									<span className="tw-w-6 tw-text-center">
										{GUITAR_STRINGS_NAMES[guitarString - 1]}
									</span>
									<span className="tw-px-0.5">-</span>
									<strong className="tw-w-6 tw-text-center">{guitarString}</strong>
								</div>
							</div>
						);
					}

					if (isEmptyVariant) {
						return (
							<div
								key={`empty-${guitarString}`}
								data-h={`empty-${guitarString}`}
								className="tw-flex tw-h-6 tw-items-center"
							>
								<GuitarString />
							</div>
						);
					}

					if (isDefaultVariant) {
						if (Array.isArray(musicNotes)) {
							const isBarreFret = isBarreFretChecker(barreFret);
							const musicNote = musicNotes.find((chord) => chord.guitarString === guitarString);

							if (isBarreFret) {
								return (
									<div
										key={`barre-${guitarString}-${number}
										}`}
										className="tw-flex tw-h-6 tw-items-center"
									>
										<GuitarString />
										{barreFret.firstGuitarString >= guitarString ? (
											<React.Fragment>
												<div className="tw-inline-flex tw-h-5 tw-w-3 tw-items-center tw-justify-center tw-rounded-sm tw-border tw-bg-white tw-font-bold tw-leading-0 tw-text-black">
													1
												</div>
												<GuitarString />
											</React.Fragment>
										) : null}
									</div>
								);
							}

							if (musicNotes.length === 0 || v.isUndefined(musicNote)) {
								return (
									<div
										key={`${guitarString}-${Date.now()}`}
										data-h={`${guitarString}-${Date.now()}`}
										className="tw-flex tw-h-6 tw-items-center"
									>
										<GuitarString />
									</div>
								);
							}

							if (musicNote) {
								return (
									<div
										key={`default-${musicNote.guitarString}-${musicNote.finger}`}
										className="tw-flex tw-h-6 tw-items-center"
									>
										<GuitarString />
										<div className="tw-inline-flex tw-h-5 tw-w-5 tw-items-center tw-justify-center tw-rounded-full tw-border tw-bg-white tw-font-bold tw-leading-0 tw-text-black">
											{musicNote.finger}
										</div>
										<GuitarString />
									</div>
								);
							}
						}
					}

					if (isSkippedGuitarStringsVariant) {
						if (Array.isArray(touchedStrings)) {
							return (
								<div
									key={`${guitarString}-${Date.now()}`}
									className="tw-mx-1 tw-flex tw-h-6 tw-items-center tw-justify-center"
								>
									<SkippedGuitarStringIcon
										touchedStrings={touchedStrings}
										guitarString={guitarString}
									/>
								</div>
							);
						}
					}

					throw new Error("It is not possible!!");
				})}
			</div>
		</div>
	);
}

GuitarFret.variant = VARIANTS;

export default GuitarFret;

// --- COMPONENTS ---

const GuitarString = twcss.span`tw-border tw-bg-black tw-block tw-h-1 tw-flex-1`;

function SkippedGuitarStringIcon({
	touchedStrings,
	guitarString,
}: {
	touchedStrings: Required<T_GuitarFretProps>["touchedStrings"];
	guitarString: T_GuitarString;
}) {
	const playedString = touchedStrings[guitarString - 1];

	if (playedString === "x") {
		return <span className="tw-text-lg tw-text-red-700">✕</span>;
	}

	if (playedString === "0") {
		return <span className="tw-relative tw--top-px tw-text-xl">⚇</span>;
	}

	if (playedString === "1") {
		return <span className="tw-relative tw--top-px tw-text-xl">⚉</span>;
	}

	return null;
}
