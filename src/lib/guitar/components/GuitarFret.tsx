// @ts-nocheck

import * as React from "react";
import classNames from "classnames";

import { Block, Icon, InlineText } from "~/components/primitive";
import twcss from "~/lib/twcss";
import { createArray, mirror } from "~/utils/objects-and-arrays";
import type { T_ReactElement, T_ReactElementNullable } from "~/types";

import { NUMBER_OF_STRINGS } from "../constants";
import {
	T_MusicNote,
	T_GuitarFret,
	T_GuitarPlayedStrings,
	I_BarreMusicNote,
	I_SimpleMusicNote,
} from "../types";

type T_Variants = "DEFAULT" | "STRINGS_NAMES" | "EMPTY" | "SKIPPED_STRINGS";
const VARIANTS = mirror(["DEFAULT", "STRINGS_NAMES", "EMPTY", "SKIPPED_STRINGS"]) as Record<
	T_Variants,
	T_Variants
>;

type T_GuitarFretProps = {
	variant: T_Variants;
	number?: T_GuitarFret;
	musicNotes?: T_MusicNote[];
	playedStrings?: T_GuitarPlayedStrings;
};

function GuitarFret(props: T_GuitarFretProps): T_ReactElement {
	const {
		// props
		musicNotes,
		number,
		playedStrings,

		// utils
		getSkippedStringValue,

		// vars
		STRINGS_NAMES,
		isDefaultVariant,
		isEmptyVariant,
		isSkippedStringsVariant,
		isStringsNamesVariant,
	} = useController(props);

	return (
		<Block
			className={classNames(
				"tw-flex-shrink-0 tw-text-xs dark:dfr-text-color-light-strong",
				isSkippedStringsVariant ? "tw-auto" : isStringsNamesVariant ? "tw-w-16" : "tw-w-10",
			)}
		>
			{!isStringsNamesVariant && (
				<Block className="tw-flex tw-h-6 tw-items-center tw-justify-center tw-text-base tw-font-bold">
					{number}
				</Block>
			)}
			<Block
				className={classNames(
					!isStringsNamesVariant &&
						!isSkippedStringsVariant &&
						"tw-border-l-4 tw-border-yellow-400 tw-bg-yellow-700",
				)}
			>
				{createArray(NUMBER_OF_STRINGS)
					.reverse()
					.map((guitarString) => {
						const isBarreMusicNote =
							isDefaultVariant &&
							Array.isArray(musicNotes) &&
							((musicNotes.length > 0 ? musicNotes[0] : {}) as I_BarreMusicNote).barre !==
								undefined;
						const musicNote =
							isBarreMusicNote && musicNotes
								? musicNotes[0]
								: isDefaultVariant
								? musicNotes?.find(
										(chord) => (chord as I_SimpleMusicNote).guitarString === guitarString,
								  )
								: undefined;

						return (
							<Block
								key={`${
									isEmptyVariant
										? `empty-${guitarString}`
										: isStringsNamesVariant
										? `guitarString-${guitarString}`
										: isBarreMusicNote
										? `barre-${guitarString}-${(musicNote as I_BarreMusicNote).guitarFret}`
										: musicNote
										? `default-${(musicNote as I_SimpleMusicNote).guitarString}-${
												(musicNote as I_SimpleMusicNote).finger
										  }`
										: `${guitarString}-${Date.now()}`
								}`}
								className="tw-flex tw-h-6 tw-items-center"
							>
								{isStringsNamesVariant ? (
									<Block className="tw-flex tw-w-full tw-justify-end tw-px-1 tw-text-base">
										<InlineText className="tw-w-6 tw-text-center">
											{STRINGS_NAMES[guitarString - 1]}
										</InlineText>
										<InlineText className="tw-px-0.5">-</InlineText>
										<InlineText
											is="strong"
											className="tw-w-6 tw-text-center"
										>
											{guitarString}
										</InlineText>
									</Block>
								) : isSkippedStringsVariant ? (
									<InlineText className="tw-mx-2">
										{getSkippedStringValue(playedStrings, guitarString)}
									</InlineText>
								) : isBarreMusicNote ? (
									<React.Fragment>
										<String />
										{(musicNote as I_BarreMusicNote)?.barre >= guitarString && (
											<InlineText className="tw-h-full tw-border-4 tw-border-white" />
										)}
										<String />
									</React.Fragment>
								) : musicNote ? (
									<React.Fragment>
										<String />
										<Block className="tw-inline-flex tw-h-5 tw-w-5 tw-items-center tw-justify-center tw-rounded-full tw-border tw-font-bold tw-leading-0 tw-text-black dfr-bg-color-light-strong">
											{(musicNote as I_SimpleMusicNote).finger}
										</Block>
										<String />
									</React.Fragment>
								) : (
									<String />
								)}
							</Block>
						);
					})}
			</Block>
		</Block>
	);
}

GuitarFret.variant = VARIANTS;

export default GuitarFret;

// --- Controller ---

function useController({ variant, ...rest }: T_GuitarFretProps) {
	const STRINGS_NAMES = ["E", "A", "D", "G", "B", "E"].reverse();
	const isDefaultVariant = variant === VARIANTS.DEFAULT;
	const isEmptyVariant = variant === VARIANTS.EMPTY;
	const isSkippedStringsVariant = variant === VARIANTS.SKIPPED_STRINGS;
	const isStringsNamesVariant = variant === VARIANTS.STRINGS_NAMES;

	function getSkippedStringValue(
		playedStrings: T_GuitarFretProps["playedStrings"],
		guitarString: number,
	): T_ReactElementNullable {
		if (!playedStrings) {
			return null;
		}

		const playedString = playedStrings[guitarString - 1];

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

		return (
			<Icon
				icon={Icon.icon.DOTS_CIRCLE_HORIZONTAL_SOLID}
				size={16}
			/>
		);
	}

	return {
		// props
		...rest,

		// utils
		getSkippedStringValue,

		// vars
		STRINGS_NAMES,
		isDefaultVariant,
		isEmptyVariant,
		isSkippedStringsVariant,
		isStringsNamesVariant,
	};
}

// --- Components ---

const String = twcss.span`tw-border tw-border-black dfr-bg-color-dark-strong tw-block tw-h-1 tw-flex-1`;
