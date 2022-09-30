import * as React from "react";
import classNames from "classnames";

import { Space, Block, Text, InlineText } from "~/components/primitive";
import { createArray } from "~/utils/objects-and-arrays";
import { generateSlug } from "~/utils/strings";
import {
	isNotEmptyArray,
	isNotEmptyString,
	isNotTrue,
	isNotUndefined,
	isNumber,
	isUndefined,
} from "~/utils/validations";
import type { T_ReactChildren, T_ReactElement, T_UnknownObject } from "~/types";

import GuitarFret from "./GuitarFret";
import { NUMBER_OF_STRINGS, parseFret, parseGuitarString } from "../utils";
import type { T_GuitarFret, T_GuitarString } from "../types";

// WARN: False positive
/* eslint-disable react/no-unused-prop-types */
type T_TablatureProps = {
	positions?: T_Positions[];
	notes?: string;
};

function Tablature(props: T_TablatureProps): T_ReactElement {
	const {
		// props
		notes,

		// vars
		parsedPositions,
	} = useController(props);

	return (
		<Block className="tw-text-base">
			{parsedPositions ? (
				<Block className="tw-flex tw-items-end">
					<GuitarFret variant={GuitarFret.variant.GUITAR_STRINGS_NAMES} />

					{parsedPositions.map((position, positionIndex) => {
						if (isSpacePosition(position)) {
							return createArray(position.space).map((space) => {
								return (
									<Block
										key={generateSlug(
											`Tablature-Block-positionIndex-${positionIndex}-space-${space}`,
										)}
										className="tw-ml-1"
									>
										{createArray(NUMBER_OF_STRINGS)
											.reverse()
											.map((guitarString) => {
												return (
													<Position
														key={generateSlug(
															`Tablature-Position-positionIndex-${positionIndex}-space-${space}-guitarString-${guitarString}`,
														)}
														isCell
													/>
												);
											})}
									</Block>
								);
							});
						}

						return (
							<Block
								key={generateSlug(`Tablature-Block-positionIndex-${positionIndex}`)}
								className="tw-ml-1"
							>
								<Block>
									{createArray(NUMBER_OF_STRINGS)
										.reverse()
										.map((guitarString) => {
											if (Array.isArray(position)) {
												const foundPosition =
													position.find(
														(item: T_UnknownObject) => item["guitarString"] === guitarString,
													) ||
													position.find((item: T_UnknownObject) => item["variant"] === "BARRE");

												if (isMusicNotePosition(foundPosition)) {
													return (
														<Position
															key={generateSlug(
																`Tablature-Position-positionIndex-${positionIndex}-guitarString-${guitarString}`,
															)}
														>
															{foundPosition.guitarFret || "0"}
														</Position>
													);
												}

												return (
													<Position
														key={generateSlug(
															`Tablature-Position-positionIndex-${positionIndex}-guitarString-${guitarString}`,
														)}
														isCell
													/>
												);
											}

											if (isMusicNotePosition(position) && position.guitarString === guitarString) {
												return (
													<Position
														key={generateSlug(
															`Tablature-Position-positionIndex-${positionIndex}-guitarString-${guitarString}`,
														)}
													>
														{position.guitarFret}
													</Position>
												);
											}

											return (
												<Position
													key={generateSlug(
														`Tablature-Position-positionIndex-${positionIndex}-guitarString-${guitarString}`,
													)}
													isCell
												/>
											);
										})}
								</Block>
							</Block>
						);
					})}
				</Block>
			) : null}

			{isNotUndefined(parsedPositions) && isNotEmptyString(notes) ? <Space size={1} /> : null}

			{isNotEmptyString(notes) ? (
				<Text className="tw-break-word tw-ml-2 tw-whitespace-pre-line tw-italic">{`"${notes}"`}</Text>
			) : null}
		</Block>
	);
}

export default Tablature;

// --- Controller ---

function useController({ positions, notes }: T_TablatureProps): {
	parsedPositions: T_TablatureProps["positions"] | undefined;
	notes: T_TablatureProps["notes"];
} {
	return {
		// props
		notes,

		// vars
		parsedPositions: isNotEmptyArray(positions)
			? [
					{ space: 1, variant: "SPACE" },
					...parsePositions(positions),
					{ space: 1, variant: "SPACE" },
			  ]
			: undefined,
	};
}

// --- Components ---

function Position({
	children,
	isCell = false,
}: {
	children?: T_ReactChildren;
	isCell?: boolean;
	isSeparator?: boolean;
}): T_ReactElement {
	return (
		<Block
			className={classNames(
				"dfr-Tablature-Position tw-relative tw-top-0.5 tw-h-6 tw-w-6 tw-text-center",
				isCell && "dfr-Tablature-Position--cell",
			)}
		>
			{isNotTrue(isCell) ? <InlineText>{children || "0"}</InlineText> : null}

			<style jsx>{`
				:global(.dfr-Tablature-Position--cell::before) {
					background-color: black;
					content: "";
					display: inline-block;
					height: 1px;
					left: 0;
					max-width: 100%;
					position: absolute;
					top: 10px;
					width: 100%;
				}

				:global(.tw-dark) :global(.dfr-Tablature-Position--cell::before) {
					background-color: white;
				}

				@media print {
					:global(.dfr-Tablature-Position--cell::before) {
						border-bottom: 1px solid black;
					}

					:global(.tw-dark) :global(.dfr-Tablature-Position--cell::before) {
						border-bottom: 1px solid white;
					}
				}
			`}</style>
		</Block>
	);
}

// --- Utils ---

function parsePositions(positions: NonNullable<T_TablatureProps["positions"]>): T_Positions[] {
	return positions.map((position) => {
		if (Array.isArray(position)) {
			return position.map((subPosition) => {
				return parsePosition(subPosition);
			});
		}

		return parsePosition(position);
	});
}

function parsePosition(position: T_UnknownObject): T_Position {
	if (isSpacePosition(position)) {
		checkTablatureSpaceValidity(position.space);

		return {
			space: position.space,
			variant: "SPACE",
		};
	}

	if (isNumber(position["guitarString"]) && isNumber(position["guitarFret"])) {
		return {
			guitarString: parseGuitarString(position["guitarString"]),
			guitarFret: parseFret(position["guitarFret"]),
			variant: "MUSIC_NOTE",
		};
	}

	if (isNumber(position["guitarString"]) && isUndefined(position["guitarFret"])) {
		return {
			guitarString: parseGuitarString(position["guitarString"]),
			variant: "GUITAR_STRING",
		};
	}

	if (isNumber(position["guitarFret"]) && isUndefined(position["guitarString"])) {
		return {
			guitarFret: parseFret(position["guitarFret"]),
			variant: "BARRE",
		};
	}

	throw new Error("Invalid tablature position");
}

function isSpacePosition(input: T_UnknownObject | T_UnknownObject[]): input is T_SpacePosition {
	return Array.isArray(input) ? false : isNumber((input as T_SpacePosition)?.space);
}

function isMusicNotePosition(input?: T_Position): input is T_MusicNotePosition {
	return (
		input?.variant === "MUSIC_NOTE" ||
		input?.variant === "BARRE" ||
		input?.variant === "GUITAR_STRING"
	);
}

function checkTablatureSpaceValidity(value: number): boolean {
	if (typeof value === "number" && (Number.isNaN(value) || !(value >= 1 || value <= 10))) {
		throw new Error(
			`Invalid tablature space (${value}). A tablature space must be between 1 and 10 or should be "x"`,
		);
	}

	return true;
}

// --- Types ---

type T_Position = T_MusicNotePosition | T_SpacePosition | T_GuitarStringPosition | T_BarrePosition;

type T_MusicNotePosition = {
	guitarString: T_GuitarString;
	guitarFret: T_GuitarFret;
	variant: "MUSIC_NOTE";
};

type T_BarrePosition = {
	guitarFret: T_GuitarFret;
	variant: "BARRE";
};

type T_GuitarStringPosition = {
	guitarString: T_GuitarString;
	variant: "GUITAR_STRING";
};

type T_SpacePosition = {
	space: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
	variant: "SPACE";
};

type T_Positions = T_Position | T_Position[];
