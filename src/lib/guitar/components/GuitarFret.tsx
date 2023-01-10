import * as React from "react";
import classNames from "classnames";

import { Block, Icon, InlineText } from "~/components/primitive";
import twcss from "~/lib/twcss";
import v from "~/lib/v";
import { createArray, mirror } from "~/utils/objects-and-arrays";
import type { T_ReactElement, T_ReactElementNullable } from "~/types";

import { NUMBER_OF_STRINGS } from "../utils";
import type { T_MusicNote, T_GuitarFret, T_GuitarString, T_Chord } from "../types";

const VARIANTS = mirror(["GUITAR_STRINGS_NAMES", "EMPTY", "DEFAULT", "SKIPPED_GUITAR_STRINGS"]);
type T_Variant = keyof typeof VARIANTS;

// WARN: False positive
/* eslint-disable react/no-unused-prop-types */
type T_GuitarFretProps = {
	variant: T_Variant;
	number?: T_GuitarFret;
	musicNotes?: T_MusicNote[];
	barreFret?: T_Chord["barreFret"];
	touchedStrings?: T_Chord["touchedStrings"];
};

function GuitarFret(props: T_GuitarFretProps): T_ReactElement {
	const {
		// props
		number,
		musicNotes,
		touchedStrings,
		barreFret,

		// utils
		isBarreFretChecker,

		// vars
		GUITAR_STRINGS_NAMES,
		isGuitarStringsNamesVariant,
		isEmptyVariant,
		isDefaultVariant,
		isSkippedGuitarStringsVariant,
	} = useController(props);

	return (
		<Block
			className={classNames(
				"tw-flex-shrink-0 tw-text-xs dark:dfr-text-color-gs-white",
				isSkippedGuitarStringsVariant
					? "tw-w-auto"
					: isGuitarStringsNamesVariant
					? "tw-w-16"
					: "tw-w-10",
			)}
		>
			{isEmptyVariant || isDefaultVariant ? (
				<Block className="tw-flex tw-h-6 tw-items-center tw-justify-center tw-text-base tw-font-bold">
					{number}
				</Block>
			) : null}

			<Block
				className={classNames(
					(isEmptyVariant || isDefaultVariant) &&
						"tw-border-l-4 tw-border-yellow-400 tw-bg-yellow-700",
				)}
			>
				{(createArray(NUMBER_OF_STRINGS).reverse() as T_GuitarString[]).map((guitarString) => {
					if (isGuitarStringsNamesVariant) {
						return (
							<Block
								key={`guitarString-${guitarString}`}
								className="tw-flex tw-h-6 tw-items-center"
							>
								<Block className="tw-flex tw-w-full tw-justify-end tw-px-1 tw-text-base">
									<InlineText className="tw-w-6 tw-text-center">
										{GUITAR_STRINGS_NAMES[guitarString - 1]}
									</InlineText>
									<InlineText className="tw-px-0.5">-</InlineText>
									<InlineText
										is="strong"
										className="tw-w-6 tw-text-center"
									>
										{guitarString}
									</InlineText>
								</Block>
							</Block>
						);
					}

					if (isEmptyVariant) {
						return (
							<Block
								key={`empty-${guitarString}`}
								data-h={`empty-${guitarString}`}
								className="tw-flex tw-h-6 tw-items-center"
							>
								<GuitarString />
							</Block>
						);
					}

					if (isDefaultVariant) {
						if (Array.isArray(musicNotes)) {
							const isBarreFret = isBarreFretChecker(barreFret);
							const musicNote = musicNotes.find((chord) => chord.guitarString === guitarString);

							if (isBarreFret) {
								return (
									<Block
										key={`barre-${guitarString}-${number}
										}`}
										className="tw-flex tw-h-6 tw-items-center"
									>
										<GuitarString />
										{barreFret.firstGuitarString >= guitarString ? (
											<React.Fragment>
												<Block className="tw-inline-flex tw-h-5 tw-w-5 tw-items-center tw-justify-center tw-rounded-full tw-border tw-font-bold tw-leading-0 dfr-bg-color-gs-white dfr-text-color-gs-black">
													1
												</Block>
												<GuitarString />
											</React.Fragment>
										) : null}
									</Block>
								);
							}

							if (musicNotes.length === 0 || v.isUndefined(musicNote)) {
								return (
									<Block
										key={`${guitarString}-${Date.now()}`}
										data-h={`${guitarString}-${Date.now()}`}
										className="tw-flex tw-h-6 tw-items-center"
									>
										<GuitarString />
									</Block>
								);
							}

							if (musicNote) {
								return (
									<Block
										key={`default-${musicNote.guitarString}-${musicNote.finger}`}
										className="tw-flex tw-h-6 tw-items-center"
									>
										<GuitarString />
										<Block className="tw-inline-flex tw-h-5 tw-w-5 tw-items-center tw-justify-center tw-rounded-full tw-border tw-font-bold tw-leading-0 dfr-bg-color-gs-white dfr-text-color-gs-black">
											{musicNote.finger}
										</Block>
										<GuitarString />
									</Block>
								);
							}
						}
					}

					if (isSkippedGuitarStringsVariant) {
						if (Array.isArray(touchedStrings)) {
							return (
								<Block
									key={`${guitarString}-${Date.now()}`}
									className="tw-mx-2 tw-flex tw-h-6 tw-items-center"
								>
									<SkippedGuitarStringIcon
										touchedStrings={touchedStrings}
										guitarString={guitarString}
									/>
								</Block>
							);
						}
					}

					throw new Error("It is not possible!!");
				})}
			</Block>
		</Block>
	);
}

GuitarFret.variant = VARIANTS;

export default GuitarFret;

// --- Controller ---

type T_UseControllerReturn = Omit<T_GuitarFretProps, "variant"> & {
	GUITAR_STRINGS_NAMES: string[];
	isDefaultVariant: boolean;
	isEmptyVariant: boolean;
	isSkippedGuitarStringsVariant: boolean;
	isGuitarStringsNamesVariant: boolean;
	isBarreFretChecker: (input: unknown) => input is NonNullable<T_Chord["barreFret"]>;
};

function useController({ variant, ...rest }: T_GuitarFretProps): T_UseControllerReturn {
	// vars
	const GUITAR_STRINGS_NAMES = ["E", "A", "D", "G", "B", "E"].reverse();
	const isDefaultVariant = variant === VARIANTS.DEFAULT;
	const isEmptyVariant = variant === VARIANTS.EMPTY;
	const isSkippedGuitarStringsVariant = variant === VARIANTS.SKIPPED_GUITAR_STRINGS;
	const isGuitarStringsNamesVariant = variant === VARIANTS.GUITAR_STRINGS_NAMES;

	// utils
	function isBarreFretChecker(input: unknown): input is NonNullable<T_Chord["barreFret"]> {
		return input !== undefined;
	}

	return {
		// props
		...rest,

		// vars
		GUITAR_STRINGS_NAMES,
		isDefaultVariant,
		isEmptyVariant,
		isSkippedGuitarStringsVariant,
		isGuitarStringsNamesVariant,

		// utils
		isBarreFretChecker,
	};
}

// --- Components ---

const GuitarString = twcss.span`tw-border dfr-bg-color-gs-black tw-block tw-h-1 tw-flex-1`;

function SkippedGuitarStringIcon({
	touchedStrings,
	guitarString,
}: {
	touchedStrings: Required<T_GuitarFretProps>["touchedStrings"];
	guitarString: T_GuitarString;
}): T_ReactElementNullable {
	const playedString = touchedStrings[guitarString - 1];

	if (playedString === "x") {
		return (
			<Icon
				icon={Icon.icon.X}
				size={16}
			/>
		);
	}

	if (playedString === "0") {
		return (
			<Icon
				icon={Icon.icon.DOTS_CIRCLE_HORIZONTAL}
				size={16}
			/>
		);
	}

	if (playedString === "1") {
		return (
			<Icon
				icon={Icon.icon.DOTS_CIRCLE_HORIZONTAL_SOLID}
				size={16}
			/>
		);
	}

	return null;
}
