import { createArray, sortBy } from "~/utils/objects-and-arrays";
import {
	isEmptyString,
	isNotEmptyArray,
	isNotTrue,
	isNotUndefined,
	isTrue,
} from "~/utils/validations";

import type {
	T_Finger,
	T_GuitarFret,
	T_GuitarString,
	T_MusicNote,
	T_ParsedChord,
	T_PlainChordDetails,
} from "./types";

class ChordVO {
	public name;

	public firstFret;

	public lastFret;

	public barreFret;

	public isBarreChord;

	public touchedStrings;

	public musicNotesGroupedByFret;

	// TODO: Regex for this input ("6x,1|4,3,1|3,3,2|2,3,3")
	constructor(unparsedChord: T_PlainChordDetails) {
		const musicNotes = generateMusicNotes(unparsedChord.musicNotes);

		this.name = unparsedChord.name;
		this.barreFret = parseBarre(unparsedChord.musicNotes);
		this.isBarreChord = isNotUndefined(this.barreFret); // TODO: ??? (is assertion)
		this.firstFret = this.isBarreChord ? this.barreFret?.fret || 1 : musicNotes[0].guitarFret;
		this.lastFret = musicNotes[musicNotes.length - 1].guitarFret;
		this.touchedStrings = parseTouchedStrings(unparsedChord.touchedStrings);
		this.musicNotesGroupedByFret = musicNotes.reduce(
			(result, musicNote: T_MusicNote): T_ParsedChord["musicNotesGroupedByFret"] => {
				return {
					...result,
					[`${musicNote.guitarFret}`]: (result[`${musicNote.guitarFret}`] || []).concat([
						musicNote,
					]),
				};
			},
			createArray(this.lastFret - this.firstFret + 1, this.firstFret).reduce(
				(
					result: T_ParsedChord["musicNotesGroupedByFret"],
					fret,
				): T_ParsedChord["musicNotesGroupedByFret"] => {
					return {
						...result,
						[`${fret}`]: [],
					};
				},
				{} as T_ParsedChord["musicNotesGroupedByFret"],
			),
		);
	}
}

export default ChordVO;

// --- Utils ---

function parseGuitarString(stringNumber: string): T_GuitarString {
	const REGEX = /^[1-6]$/;

	if (isTrue(REGEX.test(stringNumber))) {
		return Number(stringNumber) as T_GuitarString;
	}

	throw new Error("Invalid guitar string");
}

function parseFret(fret: string): T_GuitarFret {
	const REGEX = /^(^[1-9]{1}|^1[0-6]{1})$/;

	if (isTrue(REGEX.test(fret))) {
		return Number(fret) as T_GuitarFret;
	}

	throw new Error("Invalid guitar fret");
}

function parseFinger(finger: string): T_Finger | undefined {
	const REGEX = /^[1-4]$/;

	return isTrue(REGEX.test(finger)) ? (Number(finger) as T_Finger) : undefined;
}

function parseBarre(input: string): T_ParsedChord["barreFret"] {
	const numbersOfBarre = (input.match(/x/g) || []).length;

	if (numbersOfBarre > 1) {
		throw new Error("A chord only can have one barre as maximum");
	}

	if (numbersOfBarre === 1) {
		const [firstGuitarString, fret] = (
			input.split("|").filter((item) => item.includes("x"))[0] || ""
		).split(",");

		return {
			firstGuitarString: parseGuitarString(firstGuitarString.replace("x", "")),
			fret: parseFret(fret),
		};
	}

	return undefined;
}

function parseTouchedStrings(touchedStrings: string): T_ParsedChord["touchedStrings"] {
	// TODO: Regex
	return touchedStrings.split(",").reverse() as T_ParsedChord["touchedStrings"];
}

function generateMusicNotes(input: string): T_MusicNote[] {
	const musicNotes = input
		.split("|")
		.filter((item) => isNotTrue(item.includes("x")))
		.map((rawMusicNote: string): T_MusicNote => {
			const [guitarString, guitarFret, finger, ...more] = rawMusicNote.split(",");

			if (isNotEmptyArray(more)) {
				throw new Error(
					"A music note only can have 3 elements (guitarString,guitarFret,finger?) as maximum",
				);
			}

			if (isEmptyString(rawMusicNote)) {
				throw new Error(
					"You have entered a empty music note, probably because you have entered a single '|' character at the end or two '|' next to each other",
				);
			}

			// TODO: Implement this
			// throw new Error("A barre chord can't share a fret with another music note");

			return {
				guitarFret: parseFret(guitarFret),
				guitarString: parseGuitarString(guitarString),
				finger: parseFinger(finger),
			};
		});

	if (musicNotes.length === 0) {
		throw new Error("A chord must have at least one music note");
	}

	return musicNotes.sort(sortBy([{ order: "asc", param: "guitarFret" }]));
}

// TODO: Remove this probably
// function parseBarre(input: string): T_GuitarString {
// 	if (isBarreChord(input)) {
// 		return Number(replaceAll(input, "x", "")) as T_GuitarString;
// 	}

// 	// TODO: Improve error messages
// 	throw new Error("Invalid barre");
// }

// function isBarreChord(guitarString: string): boolean {
// 	const REGEX = /^[4-6]x$/;

// 	return isTrue(REGEX.test(guitarString));
// }
