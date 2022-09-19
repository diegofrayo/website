import { logger } from "~/features/logging";
import {
	sortPlainArray,
	transformObjectKeysFromSnakeCaseToLowerCamelCase,
} from "~/utils/objects-and-arrays";
import { replaceAll } from "~/utils/strings";
import { isEmptyString, isUndefined } from "~/utils/validations";

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

				currentLyricsTextLine
					.split(" ")
					.filter(Boolean)
					.sort(sortPlainArray("desc"))
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

				return `<span>${this.removeSpecialCharacters(currentLyricsTextLineParsed)}</span>`;
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

	findChord(chordNameInput: string): T_PreparsedChord | undefined {
		const { chordName, chordVariantIndex } = this.parseChordName(chordNameInput);
		const chord = (CHORDS as T_ChordsDatabase)[chordName];

		if (isUndefined(chord)) {
			return undefined;
		}

		if (Array.isArray(chord)) {
			if (isUndefined(chordVariantIndex)) {
				return chord.map((chordVariantItem, chordVariantItemIndex) => {
					return transformObjectKeysFromSnakeCaseToLowerCamelCase({
						...chordVariantItem,
						name: chordName,
						variantIndex: chordVariantItemIndex,
					});
				});
			}

			if (isUndefined(chord[chordVariantIndex])) {
				return undefined;
			}

			return transformObjectKeysFromSnakeCaseToLowerCamelCase({
				...chord[chordVariantIndex],
				name: chordName,
				variantIndex: chordVariantIndex,
			});
		}

		return transformObjectKeysFromSnakeCaseToLowerCamelCase({
			...chord,
			name: chordName,
			variantIndex: 0,
		});
	}

	private parseChordName(chordNameInput: string): {
		chordName: string;
		chordVariantIndex: number | undefined;
	} {
		// TODO: Regex
		const hasChordMultipleVariants = chordNameInput.includes("[") && chordNameInput.includes("]");
		const chordName = hasChordMultipleVariants
			? chordNameInput.substring(0, chordNameInput.lastIndexOf("["))
			: chordNameInput;
		const chordVariantIndex = hasChordMultipleVariants
			? Number(replaceAll(chordName.substring(chordName.lastIndexOf("[")), ["[", "]"], "")) - 1
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

		if (isUndefined(chord)) {
			return { parsedTextLine: currentLyricsTextLineParsed, isTextLineItemAChord: false };
		}

		const chordHTML = this.chordToHTML(chord, isBlankTheLastParsedLine, isCurrentLineTheLastOne);

		// TODO: Create a regex: Chords should be like this "{A}"
		return {
			isTextLineItemAChord: true,
			parsedTextLine: exactReplacement
				? replaceAll(currentLyricsTextLineParsed, chord.name, chordHTML)
				: replaceAll(
						replaceAll(
							replaceAll(
								replaceAll(currentLyricsTextLineParsed, ` ${chord.name} `, ` ${chordHTML} `),
								`${chord.name}|`,
								`${chordHTML}|`,
							),
							`${chord.name} `,
							`${chordHTML} `,
						),
						` ${chord.name}`,
						` ${chordHTML}`,
				  ),
		};
	}

	private removeSpecialCharacters(input: string): string {
		return replaceAll(input, "%", "");
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

		// return `<button class="dfr-Chord dfr-text-color-links ${
		// 	isCurrentLineTheLastOne ? "" : "tw-mb-1"
		// } ${isBlankTheLastParsedLine ? "" : "tw-mt-3"}" data-chord-index="${chord.variantIndex}">${
		// 	chord.name
		// }</button>`;

		// return `<button class="dfr-Chord">${chord.name}</button>`;
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
