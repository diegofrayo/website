import { logger } from "~/features/logging";
import {
	sortPlainArray,
	transformObjectKeysFromSnakeCaseToLowerCamelCase,
} from "~/utils/objects-and-arrays";
import { replaceAll } from "~/utils/strings";
import { isEmptyString, isUndefined } from "~/utils/validations";

import ChordVO from "./chord";
import CHORDS from "./data/chords.json";
import {
	T_MusicNotesGroupedByGuitarFret,
	T_ParsedChord,
	T_PreparsedChord,
	T_ChordsDatabase,
	T_PreparsedChordDetails,
} from "./types";

class GuitarService {
	parseChord(rawChordInput: string): T_ParsedChord {
		const chord = new ChordVO(rawChordInput);

		const musicNotesGroupedByGuitarFret: T_MusicNotesGroupedByGuitarFret = chord.musicNotes.reduce(
			(result, musicNote): T_MusicNotesGroupedByGuitarFret => {
				return {
					...result,
					[`${musicNote.guitarFret}`]: (result[`${musicNote.guitarFret}`] || []).concat([
						musicNote,
					]),
				};
			},
			{} as T_MusicNotesGroupedByGuitarFret,
		);

		// TODO: What it is for?
		// createArray(
		// 	Math.max(...chord.frets) - Math.min(...chord.frets) + 1,
		// 	Math.min(...chord.frets),
		// ).reduce(
		// 	(
		// 		result: T_MusicNotesGroupedByGuitarFret,
		// 		fret: T_GuitarFret,
		// 	): T_MusicNotesGroupedByGuitarFret => {
		// 		return { ...result, [`${fret}`]: [] };
		// 	},
		// 	{} as T_MusicNotesGroupedByGuitarFret,
		// ),

		return {
			firstFret: chord.musicNotes[0].guitarFret,
			lastFret: chord.musicNotes[chord.musicNotes.length - 1].guitarFret,
			barreFret: chord.barreFret,
			musicNotesGroupedByGuitarFret,
		};
	}

	parseSongLyrics(lyrics: string): string {
		let isBlankTheLastParsedLine = false;

		let songChords = {};
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
					.sort(sortPlainArray("asc"))
					.forEach((currentLyricsTextLineItem, _, currentLyricsTextLineItemsArray) => {
						const { parsedTextLine, textLineChords } = this.parseLyricsTextLine({
							currentLyricsTextLineParsed,
							currentLyricsTextLineItem,
							currentLyricsTextLineItemsArray,
							songChords,
							isCurrentLineTheLastOne,
							isBlankTheLastParsedLine,
						});

						songChords = { ...songChords, ...textLineChords };
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

	private parseLyricsTextLine({
		currentLyricsTextLineParsed,
		currentLyricsTextLineItem,
		// currentLyricsTextLineItemsArray,
		isCurrentLineTheLastOne,
		isBlankTheLastParsedLine,
	}: T_ParseLyricsTextLine): { textLineChords: Record<string, string>; parsedTextLine: string } {
		const chord = this.findChord(currentLyricsTextLineItem) as T_PreparsedChordDetails;

		if (isUndefined(chord)) {
			return { parsedTextLine: currentLyricsTextLineItem, textLineChords: {} };
		}

		const chordHTML = this.chordToHTML(chord, isBlankTheLastParsedLine, isCurrentLineTheLastOne);

		// TODO: Remove this
		// if (currentLyricsTextLineItemsArray.length === 1 || replaceExactly) {
		// 	return replaceAll(currentLyricsTextLineParsed, chord, chordHTML);
		// }

		// TODO: Create a regex: Chords should be like this "{A}"
		return {
			textLineChords: { [chord.name]: chord.name },
			parsedTextLine: replaceAll(
				replaceAll(
					replaceAll(currentLyricsTextLineParsed, ` ${chord.name} `, ` ${chordHTML} `),
					`${chord} `,
					`${chordHTML} `,
				),
				` ${chord}`,
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
		return `<button class="dfr-Chord dfr-text-color-links ${
			isCurrentLineTheLastOne ? "" : "tw-mb-1"
		} ${isBlankTheLastParsedLine ? "" : "tw-mt-3"}" data-chord-index="${chord.variantIndex}">${
			chord.name
		}</button>`;
	}
}

export default new GuitarService();

// --- Types ---

type T_ParseLyricsTextLine = {
	currentLyricsTextLineParsed: string;
	currentLyricsTextLineItem: string;
	currentLyricsTextLineItemsArray: string[];
	songChords: Record<string, string>;
	isCurrentLineTheLastOne: boolean;
	isBlankTheLastParsedLine: boolean;
};
