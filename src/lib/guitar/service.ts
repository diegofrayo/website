import { logger } from "~/features/logging";
import { transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/objects-and-arrays";
import { replaceAll } from "~/utils/strings";
import { exists, isEmptyString, notFound } from "~/utils/validations";

import ChordVO from "./chord-vo";
import CHORDS from "./data/chords.json";
import type { T_ChordsDatabase, T_ParsedChord, T_PlainChord, T_PlainChordDetails } from "./types";

class GuitarService {
	parseChord(plainChordDetails: T_PlainChordDetails): T_ParsedChord {
		return new ChordVO(plainChordDetails);
	}

	parseSongLyrics(lyrics: string): string {
		const songChords: Record<string, string> = {};
		let isBlankTheLastParsedTextLine = false;

		const parsedLyrics = lyrics
			.split("\n")
			.map((currentTextLine, currentTextLineIndex, lyricsTextLinesArray) => {
				const isCurrentLineTheLastOne = currentTextLineIndex === lyricsTextLinesArray.length - 1;

				if (isEmptyString(currentTextLine)) {
					isBlankTheLastParsedTextLine = true;

					/*
					 * I'm replacing blank lines for <br> elements
					 * first:tw-hidden is a little hack
					 * to avoid showing multiple <br> elements in a row
					 */
					return `<br class="first:tw-hidden" />`;
				}

				const currentTextLineParsed = currentTextLine
					.split(" ")
					.filter(Boolean)
					.sort(this.sortTextLineItemsByLength)
					.reduce((result, currentTextLineItem, _, currentTextLineItemsArray) => {
						const { parsedTextLine, isCurrentTextLineItemAChord } = this.parseTextLine({
							currentTextLineItem,
							currentTextLineParsed: result,
							exactReplacement: currentTextLineItemsArray.length === 1,
							isCurrentLineTheLastOne,
							isBlankTheLastParsedTextLine,
						});

						if (isCurrentTextLineItemAChord) {
							songChords[currentTextLineItem] = currentTextLineItem;
						}

						return parsedTextLine;
					}, currentTextLine);

				isBlankTheLastParsedTextLine = false;
				return `<span>${currentTextLineParsed}</span>`;
			})
			.join("\n");

		logger(
			"LOG",
			`"chords": [${Object.keys(songChords)
				.sort()
				.map((chord) => `"${chord}"`)
				.join(",")}]`,
		);

		return parsedLyrics;
	}

	findChord(
		chordNameInput: string,
		options?: { returnAllVariants: boolean },
	): T_PlainChord | undefined {
		const { chordName, chordVariantIndex } = this.parseChordName(chordNameInput);
		const chord = (CHORDS as unknown as T_ChordsDatabase)[chordName];

		if (notFound(chord)) {
			return undefined;
		}

		if (Array.isArray(chord)) {
			if (options?.returnAllVariants) {
				return chord.map((chordVariantItem, chordVariantItemIndex) => {
					return transformObjectKeysFromSnakeCaseToLowerCamelCase({
						...chordVariantItem,
						name: chordName,
						variantIndex: chordVariantItemIndex,
					});
				});
			}

			if (exists(chord[chordVariantIndex])) {
				return transformObjectKeysFromSnakeCaseToLowerCamelCase({
					...chord[chordVariantIndex],
					name: chordName,
					variantIndex: chordVariantIndex,
				});
			}

			return undefined;
		}

		return transformObjectKeysFromSnakeCaseToLowerCamelCase({
			...chord,
			name: chordName,
			variantIndex: 0,
		});
	}

	private parseChordName(chordNameInput: string): {
		chordName: string;
		chordVariantIndex: number;
	} {
		// TODO: Regex
		const hasChordMultipleVariants = chordNameInput.includes("[") && chordNameInput.includes("]");
		const chordName = hasChordMultipleVariants
			? chordNameInput.substring(0, chordNameInput.lastIndexOf("["))
			: chordNameInput;
		const chordVariantIndex = hasChordMultipleVariants
			? Number(
					replaceAll(chordNameInput.substring(chordNameInput.lastIndexOf("[")), ["[", "]"], ""),
			  ) - 1
			: 0;

		return { chordName, chordVariantIndex };
	}

	private parseTextLine({
		currentTextLineItem,
		currentTextLineParsed,
		exactReplacement,
		isCurrentLineTheLastOne,
		isBlankTheLastParsedTextLine,
	}: T_ParseLyricsTextLineParams): {
		parsedTextLine: string;
		isCurrentTextLineItemAChord: boolean;
	} {
		// TODO: It is possible to avoid this as?
		const chord = this.findChord(currentTextLineItem) as T_PlainChordDetails;

		if (notFound(chord)) {
			return { parsedTextLine: currentTextLineParsed, isCurrentTextLineItemAChord: false };
		}

		const chordHTML = this.chordToHTML(
			chord,
			isBlankTheLastParsedTextLine,
			isCurrentLineTheLastOne,
		);

		return {
			parsedTextLine: exactReplacement
				? replaceAll(currentTextLineParsed, currentTextLineItem, chordHTML)
				: replaceAll(
						replaceAll(
							replaceAll(
								replaceAll(currentTextLineParsed, ` ${currentTextLineItem} `, ` ${chordHTML} `),
								`${currentTextLineItem}|`,
								`${chordHTML}|`,
							),
							`${currentTextLineItem} `,
							`${chordHTML} `,
						),
						` ${currentTextLineItem}`,
						` ${chordHTML}`,
				  ),
			isCurrentTextLineItemAChord: true,
		};
	}

	private chordToHTML(
		chord: T_PlainChordDetails,
		isBlankTheLastParsedTextLine: boolean,
		isCurrentLineTheLastOne: boolean,
	): string {
		return `<button class="dfr-Chord dfr-text-color-links${
			isCurrentLineTheLastOne ? "" : " tw-mb-1"
		}${isBlankTheLastParsedTextLine ? "" : " tw-mt-3"}" data-chord-index="${chord.variantIndex}">${
			chord.name
		}</button>`;
	}

	private sortTextLineItemsByLength(a: string, b: string): number {
		if (a.length < b.length) {
			return 1;
		}

		return -1;
	}
}

export default new GuitarService();

// --- Types ---

type T_ParseLyricsTextLineParams = {
	currentTextLineItem: string;
	currentTextLineParsed: string;
	exactReplacement: boolean;
	isCurrentLineTheLastOne: boolean;
	isBlankTheLastParsedTextLine: boolean;
};
