import v from "../v";
import { createArray } from "../utils/arrays-and-objects";
import { sortBy } from "../sort";

import { parseFret, parseGuitarString } from "./utils";
import type { T_Finger, T_MusicNote, T_Chord, T_PlainChordDetails } from "./types";

class Chord {
	public name;

	public firstFret;

	public lastFret;

	public barreFret;

	public touchedStrings;

	public musicNotesGroupedByFret;

	constructor(plainChord: T_PlainChordDetails) {
		const musicNotes = generateMusicNotes(plainChord.musicNotes);

		this.name = plainChord.name;
		this.barreFret = parseBarre(plainChord.musicNotes);
		this.firstFret = v.isUndefined(this.barreFret) ? musicNotes[0].guitarFret : this.barreFret.fret;
		this.lastFret = musicNotes[musicNotes.length - 1].guitarFret;
		this.touchedStrings = parseTouchedStrings(plainChord.touchedStrings);
		this.musicNotesGroupedByFret = musicNotes.reduce(
			(result, musicNote) => {
				return {
					...result,
					[`${musicNote.guitarFret}`]: (result[`${musicNote.guitarFret}`] || []).concat([
						musicNote,
					]),
				};
			},
			createArray(this.lastFret - this.firstFret + 1, this.firstFret).reduce(
				(result, fret) => {
					return {
						...result,
						[`${fret}`]: [],
					};
				},
				{} as T_Chord["musicNotesGroupedByFret"],
			),
		);
	}
}

export default Chord;

// --- UTILS ---

function parseFinger(finger: string | undefined): T_Finger | undefined {
	if (v.isUndefined(finger)) return undefined;

	const REGEX = /^[1-4]$/;

	if (v.isTrue(REGEX.test(finger))) {
		return Number(finger) as T_Finger;
	}

	throw new Error(`Invalid finger => value: (${finger}) | typeof: (${typeof finger})`);
}

function parseBarre(input: string): T_Chord["barreFret"] {
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

function parseTouchedStrings(touchedStrings: string): T_Chord["touchedStrings"] {
	// TODO: Regex
	return touchedStrings.split(",").reverse() as T_Chord["touchedStrings"];
}

// TODO: Regex for this input ("6x,1|4,3,1|3,3,2|2,3,3")
function generateMusicNotes(input: string): T_MusicNote[] {
	const musicNotes = input
		.split("|")
		.filter((item) => v.isNotTrue(item.includes("x")))
		.map((rawMusicNote: string): T_MusicNote => {
			const [guitarString, guitarFret, finger, ...more] = rawMusicNote.split(",");

			if (v.isNotEmptyArray(more)) {
				throw new Error(
					"A music note only can have 3 elements (guitarString,guitarFret,finger?) as maximum",
				);
			}

			if (v.isEmptyString(rawMusicNote)) {
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

	return musicNotes.sort(sortBy("guitarFret"));
}
