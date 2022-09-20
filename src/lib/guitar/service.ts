import {
	sortPlainArray,
	transformObjectKeysFromSnakeCaseToLowerCamelCase,
} from "~/utils/objects-and-arrays";
import { replaceAll } from "~/utils/strings";
import { exists, isEmptyString, isNotEmptyString, notFound } from "~/utils/validations";

import Chord from "./chord-vo";
import CHORDS from "./data/chords.json";
import type { T_ChordsDatabase, T_ParsedChord, T_PlainChord, T_PlainChordDetails } from "./types";

class GuitarService {
	public CHORD_BUTTON_SELECTOR = "dfr-GuitarChord";

	parseChord(plainChordDetails: T_PlainChordDetails): T_ParsedChord {
		return new Chord(plainChordDetails);
	}

	parseMusicText(lyrics: string): { parsedText: string; foundChords: string[] } {
		let isTheLastParsedTextLineBlank = false;

		const foundChords: Record<string, string> = {};
		const parsedText = lyrics
			.split("\n")
			.map((currentTextLine, currentTextLineIndex, lyricsTextLinesArray) => {
				const isCurrentLineTheLastOne = currentTextLineIndex === lyricsTextLinesArray.length - 1;

				if (isEmptyString(currentTextLine)) {
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
					.filter((currentTextLineItem) => isNotEmptyString(currentTextLineItem))
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
		options?: { returnAllVariants: boolean },
	): T_PlainChord | undefined {
		const { chordName, chordVariantIndex } = this.parseChordName(rawChordName);
		const chord = (CHORDS as unknown as T_ChordsDatabase)[chordName];

		if (notFound(chord)) {
			return undefined;
		}

		if (Array.isArray(chord)) {
			if (options?.returnAllVariants) {
				return chord.map((chordVariant, index) => {
					return transformObjectKeysFromSnakeCaseToLowerCamelCase({
						...chordVariant,
						name: chordName,
						variantIndex: index,
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

	private parseChordName(rawChordName: string): {
		chordName: string;
		chordVariantIndex: number;
	} {
		// TODO: Regex for this kind of inputs: G[2] and try to extract the value inside of []
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
		// TODO: It is possible to avoid this as?
		const chord = this.findChord(currentTextLineItem) as T_PlainChordDetails;

		if (notFound(chord)) {
			return { parsedTextLine: currentTextLineParsed, isCurrentTextLineItemAChord: false };
		}

		const chordAsHTML = this.chordToHTML(
			chord,
			isTheLastParsedTextLineBlank,
			isCurrentLineTheLastOne,
		);

		return {
			parsedTextLine: exactReplacement
				? replaceAll(currentTextLineParsed, currentTextLineItem, chordAsHTML)
				: replaceAll(
						replaceAll(
							replaceAll(
								replaceAll(currentTextLineParsed, ` ${currentTextLineItem} `, ` ${chordAsHTML} `),
								`${currentTextLineItem}|`,
								`${chordAsHTML}|`,
							),
							`${currentTextLineItem} `,
							`${chordAsHTML} `,
						),
						` ${currentTextLineItem}`,
						` ${chordAsHTML}`,
				  ),
			isCurrentTextLineItemAChord: true,
		};
	}

	private chordToHTML(
		chord: T_PlainChordDetails,
		isTheLastParsedTextLineBlank: boolean,
		isCurrentLineTheLastOne: boolean,
	): string {
		return `<button class="${this.CHORD_BUTTON_SELECTOR} dfr-text-color-links${
			isCurrentLineTheLastOne ? "" : " tw-mb-1"
		}${isTheLastParsedTextLineBlank ? "" : " tw-mt-3"}" data-chord-index="${chord.variantIndex}">${
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
