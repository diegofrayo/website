// import { sortPlainArray } from "~/utils/objects-and-arrays";
import { replaceAll } from "~/utils/strings";
import { isEmptyString, isNotEmptyArray, isTrue } from "~/utils/validations";

import type { T_Finger, T_GuitarFret, T_GuitarString, T_MusicNote } from "./types";

class Chord {
	public isBarreChord = false;
	// public frets: T_GuitarFret[] = [];
	public musicNotes: T_MusicNote[] = [];

	// input: "6x,1|4,3,1|3,3,2|2,3,3"
	constructor(input: string) {
		const numbersOfBarre = (input.match(/x/g) || []).length;

		if (numbersOfBarre > 1) throw new Error("Please no double barre");

		this.isBarreChord = numbersOfBarre === 1;

		// TODO: Regex for inputs
		// throw new Error("A barre chord can't share a fret with another music note");

		this.musicNotes = input.split("|").map((rawMusicNote: string): T_MusicNote => {
			const [guitarString, guitarFret, finger, ...more] = rawMusicNote.split(",");

			if (isNotEmptyArray(more)) {
				throw new Error(
					"A music note only can have 3 elements (guitarString,guitarFret,finger?) as maximum",
				);
			}

			if (isEmptyString(rawMusicNote)) {
				throw new Error(
					"You have entered a empty music note, probably you entered a '|' character at the end",
				);
			}

			if (isBarreChord(guitarString)) {
				return {
					guitarFret: parseFret(guitarFret),
					barre: parseBarre(guitarString),
				};
			}

			return {
				guitarFret: parseFret(guitarFret),
				guitarString: parseGuitarString(guitarString),
				finger: parseFinger(finger),
			};
		});

		// this.frets = this.musicNotes
		// 	.map((musicNote) => {
		// 		return musicNote.guitarFret;
		// 	})
		// 	.sort(sortPlainArray("asc"));

		if (this.musicNotes.length === 0) {
			throw new Error("A chord must have at least one music note");
		}
	}
}

export default Chord;

// --- Utils ---

function parseFinger(finger: string): T_Finger | undefined {
	const REGEX = new RegExp("^[1-4]$");

	return isTrue(REGEX.test(finger)) ? (Number(finger) as T_Finger) : undefined;
}

function parseFret(fret: string): T_GuitarFret {
	const REGEX = new RegExp("^(^[1-9]{1}|^1[0-6]{1})$");

	if (isTrue(REGEX.test(fret))) {
		return Number(fret) as T_GuitarString;
	}

	throw new Error("Invalid guitar fret");
}

function parseGuitarString(stringNumber: string): T_GuitarString {
	const REGEX = new RegExp("^[1-6]$");

	if (isTrue(REGEX.test(stringNumber))) {
		return Number(stringNumber) as T_GuitarString;
	}

	throw new Error("Invalid guitar string");
}

function parseBarre(input: string): T_GuitarString {
	if (isBarreChord(input)) {
		return Number(replaceAll(input, "x", "")) as T_GuitarString;
	}

	throw new Error("Invalid barre");
}

function isBarreChord(guitarString: string): boolean {
	const REGEX = new RegExp("^[4-6]x$");

	return isTrue(REGEX.test(guitarString));
}
