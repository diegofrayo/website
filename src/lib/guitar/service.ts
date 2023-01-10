import v from "~/lib/v";
import { sortPlainArray } from "~/utils/objects-and-arrays";
import { replaceAll } from "~/utils/strings";

import Chord from "./chord";
import CHORDS from "./data/chords.json";
import type { T_ChordsDatabase, T_Chord, T_PlainChord, T_PlainChordDetails } from "./types";

class GuitarService {
	public CHORD_BUTTON_SELECTOR = "dfr-GuitarChord";

	parseChord(plainChordDetails: T_PlainChordDetails): T_Chord {
		return new Chord(plainChordDetails);
	}

	parseMusicText(lyrics: string): { parsedText: string; foundChords: string[] } {
		let isTheLastParsedTextLineBlank = false;

		const foundChords: Record<string, string> = {};
		const parsedText = lyrics
			.split("\n")
			.map((currentTextLine, currentTextLineIndex, lyricsTextLinesArray) => {
				const isCurrentLineTheLastOne = currentTextLineIndex === lyricsTextLinesArray.length - 1;

				if (v.isEmptyString(currentTextLine)) {
					isTheLastParsedTextLineBlank = true;

					/*
					 * I'm replacing blank lines for <br> elements
					 * first:tw-hidden is a little hack
					 * to avoid showing multiple <br> elements in a row
					 */
					return `<br class="first:tw-hidden" />`;
				}

				const currentTextLineParsed = currentTextLine
					.split(" ")
					.filter((currentTextLineItem) => v.isNotEmptyString(currentTextLineItem))
					.sort(this.sortTextLineItemsByLength)
					.reduce((result, currentTextLineItem, _, currentTextLineItemsArray) => {
						const { parsedTextLine, isCurrentTextLineItemAChord } = this.parseTextLine({
							currentTextLineItem,
							currentTextLineParsed: result,
							exactReplacement: currentTextLineItemsArray.length === 1,
							isCurrentLineTheLastOne,
							isTheLastParsedTextLineBlank,
						});

						if (isCurrentTextLineItemAChord) {
							foundChords[currentTextLineItem] = currentTextLineItem;
						}

						return parsedTextLine;
					}, currentTextLine);

				isTheLastParsedTextLineBlank = false;
				return `<span>${currentTextLineParsed}</span>`;
			})
			.join("\n");

		return { parsedText, foundChords: Object.keys(foundChords).sort(sortPlainArray("asc")) };
	}

	findChord(
		rawChordName: string,
		options: { returnAllVariants: boolean },
	): T_PlainChordDetails[] | undefined;
	findChord(rawChordName: string): T_PlainChordDetails | undefined;
	findChord(
		rawChordName: string,
		options?: { returnAllVariants: boolean },
	): T_PlainChord | undefined {
		const { chordName, chordVariantIndex } = this.parseChordName(rawChordName);
		const chord = (CHORDS as unknown as T_ChordsDatabase)[chordName];

		if (v.notFound(chord)) {
			return undefined;
		}

		if (Array.isArray(chord)) {
			if (options?.returnAllVariants) {
				return chord.map((chordVariant, index) => {
					return {
						name: chordName,
						musicNotes: chordVariant.music_notes,
						touchedStrings: chordVariant.touched_strings,
						variantIndex: index,
					};
				});
			}

			if (v.exists(chord[chordVariantIndex])) {
				return {
					name: chordName,
					musicNotes: chord[chordVariantIndex].music_notes,
					touchedStrings: chord[chordVariantIndex].touched_strings,
					variantIndex: chordVariantIndex,
				};
			}

			return undefined;
		}

		return {
			name: chordName,
			musicNotes: chord.music_notes,
			touchedStrings: chord.touched_strings,
			variantIndex: 0,
		};
	}

	private parseChordName(rawChordName: string): {
		chordName: string;
		chordVariantIndex: number;
	} {
		// TODO: [REGEX] | Regex for this kind of inputs: G[2] and try to extract the value inside of [] ^(A|B|C|D|E|F|G)(\w{1-5})?(\[[1-9]\])?$(([a-z]|\/|#){1-5})?
		const hasChordMultipleVariants = rawChordName.includes("[") && rawChordName.includes("]");
		const chordName = hasChordMultipleVariants
			? rawChordName.substring(0, rawChordName.lastIndexOf("["))
			: rawChordName;
		const chordVariantIndex = hasChordMultipleVariants
			? Number(replaceAll(rawChordName.substring(rawChordName.lastIndexOf("[")), ["[", "]"], "")) -
			  1
			: 0;

		return { chordName, chordVariantIndex };
	}

	private parseTextLine({
		currentTextLineItem,
		currentTextLineParsed,
		exactReplacement,
		isCurrentLineTheLastOne,
		isTheLastParsedTextLineBlank,
	}: {
		currentTextLineItem: string;
		currentTextLineParsed: string;
		exactReplacement: boolean;
		isCurrentLineTheLastOne: boolean;
		isTheLastParsedTextLineBlank: boolean;
	}): {
		parsedTextLine: string;
		isCurrentTextLineItemAChord: boolean;
	} {
		const chord = this.findChord(currentTextLineItem);

		if (v.notFound(chord)) {
			return { parsedTextLine: currentTextLineParsed, isCurrentTextLineItemAChord: false };
		}

		const chordAsHTML = this.chordToHTML(
			chord,
			isTheLastParsedTextLineBlank,
			isCurrentLineTheLastOne,
		);
		let parsedTextLine = "";

		if (exactReplacement) {
			parsedTextLine = replaceAll(currentTextLineParsed, currentTextLineItem, chordAsHTML);
		} else {
			parsedTextLine = replaceAll(
				currentTextLineParsed,
				` ${currentTextLineItem} `,
				` ${chordAsHTML} `,
			);
			parsedTextLine = replaceAll(parsedTextLine, `${currentTextLineItem}|`, `${chordAsHTML}|`);
			parsedTextLine = replaceAll(parsedTextLine, `${currentTextLineItem} `, `${chordAsHTML} `);
			parsedTextLine = replaceAll(parsedTextLine, ` ${currentTextLineItem}`, ` ${chordAsHTML}`);
		}

		return {
			parsedTextLine,
			isCurrentTextLineItemAChord: true,
		};
	}

	private chordToHTML(
		chord: T_PlainChordDetails,
		isTheLastParsedTextLineBlank: boolean,
		isCurrentLineTheLastOne: boolean,
	): string {
		/*
		 * No default variant chords are written like this: G[2]
		 * To keep the right spacing between the lyrics and chords
		 * it is necessary to replace [2] with three spaces
		 */
		const REPLACE_SPACES_FOR_NO_DEFAULT_VARIANT_CHORDS = "   ";
		const isDefaultVariantChord = chord.variantIndex === 0;

		return `<button class="${this.CHORD_BUTTON_SELECTOR} dfr-text-color-links${
			isCurrentLineTheLastOne ? "" : " tw-mb-1"
		}${isTheLastParsedTextLineBlank ? "" : " tw-mt-3"}" data-chord-index="${chord.variantIndex}">${
			isDefaultVariantChord
				? chord.name
				: `${chord.name}${REPLACE_SPACES_FOR_NO_DEFAULT_VARIANT_CHORDS}`
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
