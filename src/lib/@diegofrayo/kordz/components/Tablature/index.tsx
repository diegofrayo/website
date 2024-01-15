import * as React from "react";
import cn from "classnames";

import type DR from "../../../types";
import { createArray } from "../../../utils/arrays-and-objects";
import { generateSlug } from "../../../utils/strings";
import v from "../../../v";

import GuitarFret from "../GuitarFret";
import { NUMBER_OF_STRINGS, parseFret, parseGuitarString } from "../../utils";
import type { T_GuitarFret, T_GuitarString } from "../../types";

import styles from "./styles.module.css";

type T_TablatureProps = {
	positions?: T_Positions[];
	notes?: string;
};

function Tablature({ positions, notes }: T_TablatureProps) {
	// --- VARS ---
	const parsedPositions: T_TablatureProps["positions"] | undefined = v.isNotEmptyArray(positions)
		? [{ space: 1, variant: "SPACE" }, ...parsePositions(positions), { space: 1, variant: "SPACE" }]
		: undefined;

	return (
		<div className="tw-text-base">
			{parsedPositions ? (
				<div className="tw-flex tw-items-end">
					<GuitarFret variant={GuitarFret.variant.GUITAR_STRINGS_NAMES} />

					{parsedPositions.map((position, positionIndex) => {
						if (isSpacePosition(position)) {
							return createArray(position.space).map((space) => {
								return (
									<div
										key={generateSlug(
											`Tablature-div-positionIndex-${positionIndex}-space-${space}`,
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
									</div>
								);
							});
						}

						return (
							<div
								key={generateSlug(`Tablature-div-positionIndex-${positionIndex}`)}
								className="tw-ml-1"
							>
								<div>
									{createArray(NUMBER_OF_STRINGS)
										.reverse()
										.map((guitarString) => {
											if (Array.isArray(position)) {
												const foundPosition =
													position.find(
														(item: DR.Object) => item["guitarString"] === guitarString,
													) || position.find((item: DR.Object) => item["variant"] === "BARRE");

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
								</div>
							</div>
						);
					})}
				</div>
			) : null}

			{v.isNotUndefined(parsedPositions) && v.isNotEmptyString(notes) ? (
				<hr className="tw-my-0.5 tw-border-0 tw-bg-transparent" />
			) : null}

			{v.isNotEmptyString(notes) ? (
				<p className="tw-break-word tw-ml-2 tw-whitespace-pre-line tw-italic">{`"${notes}"`}</p>
			) : null}
		</div>
	);
}

export default Tablature;

// --- COMPONENTS ---

function Position({
	children,
	isCell = false,
}: {
	children?: DR.React.Children;
	isCell?: boolean;
}) {
	return (
		<div
			className={cn(
				styles["dr-tablature-position"],
				"tw-relative tw-top-0.5 tw-h-6 tw-w-6 tw-text-center",
				isCell && styles["dr-tablature-position--cell"],
			)}
		>
			{v.isNotTrue(isCell) ? <span>{children || "0"}</span> : null}
		</div>
	);
}

// --- UTILS ---

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

function parsePosition(position: DR.Object): T_Position {
	if (isSpacePosition(position)) {
		checkTablatureSpaceValidity(position.space);

		return {
			space: position.space,
			variant: "SPACE",
		};
	}

	if (v.isNumber(position["guitarString"]) && v.isNumber(position["guitarFret"])) {
		return {
			guitarString: parseGuitarString(position["guitarString"]),
			guitarFret: parseFret(position["guitarFret"]),
			variant: "MUSIC_NOTE",
		};
	}

	if (v.isNumber(position["guitarString"]) && v.isUndefined(position["guitarFret"])) {
		return {
			guitarString: parseGuitarString(position["guitarString"]),
			variant: "GUITAR_STRING",
		};
	}

	if (v.isNumber(position["guitarFret"]) && v.isUndefined(position["guitarString"])) {
		return {
			guitarFret: parseFret(position["guitarFret"]),
			variant: "BARRE",
		};
	}

	throw new Error("Invalid tablature position");
}

function isSpacePosition(input: DR.Object | DR.Object[]): input is T_SpacePosition {
	return Array.isArray(input) ? false : v.isNumber((input as T_SpacePosition)?.space);
}

function isMusicNotePosition(input?: T_Position): input is T_MusicNotePosition {
	return (
		input?.variant === "MUSIC_NOTE" ||
		input?.variant === "BARRE" ||
		input?.variant === "GUITAR_STRING"
	);
}

function checkTablatureSpaceValidity(value: number) {
	if (typeof value === "number" && (Number.isNaN(value) || !(value >= 1 || value <= 10))) {
		throw new Error(
			`Invalid tablature space (${value}). A tablature space must be between 1 and 10 or should be "x"`,
		);
	}

	return true;
}

// --- TYPES ---

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
