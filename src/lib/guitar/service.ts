import { logger } from "~/features/logging";
import { transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/objects-and-arrays";
import { replaceAll } from "~/utils/strings";
import { exists, isEmptyString, notFound } from "~/utils/validations";

import ChordVO from "./chord-vo";
import CHORDS from "./data/chords.json";
import {
	T_PreparsedChord,
	T_ChordsDatabase,
	T_PreparsedChordDetails,
	T_Chord,
	T_UnparsedChordDetails,
} from "./types";

class GuitarService {
	// TODO: Regex for this input ("6x,1|4,3,1|3,3,2|2,3,3")
	parseChord(unparsedChord: T_UnparsedChordDetails): T_Chord {
		const chord = new ChordVO(unparsedChord);

		return chord;
	}

	parseSongLyrics(lyrics: string): string {
		let isBlankTheLastParsedLine = false;

		const songChords: Record<string, string> = {};
		const parsedLyrics = lyrics
			.split("\n")
			.map((currentLyricsTextLine, currentLyricsTextLineIndex, lyricsTextLinesArray) => {
				const isCurrentLineTheLastOne =
					currentLyricsTextLineIndex === lyricsTextLinesArray.length - 1;
				let currentLyricsTextLineParsed = currentLyricsTextLine;

				if (isEmptyString(currentLyricsTextLineParsed)) {
					isBlankTheLastParsedLine = true;

					// I'm replacing blank lines for <br> elements
					// first:tw-hidden is a little hack
					// to avoid showing multiple <br> elements in a row
					return `<br class="first:tw-hidden" />`;
				}

				isBlankTheLastParsedLine = false;

				// TODO: % special characters
				currentLyricsTextLine
					.split(" ")
					.filter(Boolean)
					.sort(this.sortTextLineItems)
					.forEach((currentLyricsTextLineItem, _, currentLyricsTextLineItemsArray) => {
						const { parsedTextLine, isTextLineItemAChord } = this.parseTextLine({
							currentLyricsTextLineParsed,
							currentLyricsTextLineItem,
							exactReplacement: currentLyricsTextLineItemsArray.length === 1,
							songChords,
							isCurrentLineTheLastOne,
							isBlankTheLastParsedLine,
						});

						if (isTextLineItemAChord) {
							songChords[currentLyricsTextLineItem] = currentLyricsTextLineItem;
						}

						currentLyricsTextLineParsed = parsedTextLine;
					});

				return `<span>${currentLyricsTextLineParsed}</span>`;
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
	): T_PreparsedChord | undefined {
		const { chordName, chordVariantIndex } = this.parseChordName(chordNameInput);
		const chord = (CHORDS as T_ChordsDatabase)[chordName];

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
		currentLyricsTextLineParsed,
		currentLyricsTextLineItem,
		exactReplacement,
		isCurrentLineTheLastOne,
		isBlankTheLastParsedLine,
	}: T_ParseLyricsTextLine): { isTextLineItemAChord: boolean; parsedTextLine: string } {
		const chord = this.findChord(currentLyricsTextLineItem) as T_PreparsedChordDetails;

		if (notFound(chord)) {
			return { parsedTextLine: currentLyricsTextLineParsed, isTextLineItemAChord: false };
		}

		const chordHTML = this.chordToHTML(chord, isBlankTheLastParsedLine, isCurrentLineTheLastOne);

		// TODO: Create a regex: Chords should be like this "{A}"
		return {
			isTextLineItemAChord: true,
			parsedTextLine: exactReplacement
				? replaceAll(currentLyricsTextLineParsed, currentLyricsTextLineItem, chordHTML)
				: replaceAll(
						replaceAll(
							replaceAll(
								replaceAll(
									currentLyricsTextLineParsed,
									` ${currentLyricsTextLineItem} `,
									` ${chordHTML} `,
								),
								`${currentLyricsTextLineItem}|`,
								`${chordHTML}|`,
							),
							`${currentLyricsTextLineItem} `,
							`${chordHTML} `,
						),
						` ${currentLyricsTextLineItem}`,
						` ${chordHTML}`,
				  ),
		};
	}

	private chordToHTML(
		chord: T_PreparsedChordDetails,
		isBlankTheLastParsedLine: boolean,
		isCurrentLineTheLastOne: boolean,
	): string {
		return `<button class="dfr-Chord dfr-text-color-links${
			isCurrentLineTheLastOne ? "" : " tw-mb-1"
		}${isBlankTheLastParsedLine ? "" : " tw-mt-3"}" data-chord-index="${chord.variantIndex}">${
			chord.name
		}</button>`;
	}

	private sortTextLineItems(a: string, b: string): number {
		if (a.length < b.length) {
			return 1;
		}

		return -1;
	}
}

export default new GuitarService();

// --- Types ---

type T_ParseLyricsTextLine = {
	currentLyricsTextLineParsed: string;
	currentLyricsTextLineItem: string;
	exactReplacement: boolean;
	songChords: Record<string, string>;
	isCurrentLineTheLastOne: boolean;
	isBlankTheLastParsedLine: boolean;
};
