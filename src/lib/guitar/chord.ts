import { isEmptyString, isNotEmptyArray } from "~/utils/validations";

import type { T_MusicNote } from "./types";
import { isBarreChord, parseBarre, parseFinger, parseFret, parseGuitarString } from "./utils";

class Chord {
	public musicNotes: T_MusicNote[] = [];
	public isBarreChord = false;

	// input: "6x,1|4,3,1|3,3,2|2,3,3"
	constructor(input: string) {
		// TODO: Regex for inputs
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
				if (this.isBarreChord) throw new Error("Please no double barre");

				this.isBarreChord = true;

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

		if (this.musicNotes.length === 0) {
			throw new Error("A chord must have at least one music note");
		}
	}
}

export default Chord;
