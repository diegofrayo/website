import { replaceAll } from "~/utils/strings";
import { isTrue } from "~/utils/validations";

import { T_Finger, T_GuitarFret, T_GuitarString } from "./types";

/*
{ "music_notes": "6x,1|4,3,1|3,3,2|2,3,3", "played_strings": "x,0,1,1,1,0" },

{ "music_notes": "6x,6|5,8,3|4,8,4|3,7,2", "played_strings": "0,1,1,1,0,0" }

Fret, String, Finger

Fret = 1-20 + x?
String = 1-6 | [6-4]x | undefined
Finger = 1-4 | undefined
*/

export function parseFinger(finger: string): T_Finger | undefined {
	const REGEX = new RegExp("^[1-4]$");

	return isTrue(REGEX.test(finger)) ? (Number(finger) as T_Finger) : undefined;
}

export function parseFret(fret: string): T_GuitarFret {
	const REGEX = new RegExp("^(^[1-9]{1}|^1[0-6]{1})$");

	if (isTrue(REGEX.test(fret))) {
		return Number(fret) as T_GuitarString;
	}

	throw new Error("Invalid guitar fret");
}

export function parseGuitarString(stringNumber: string): T_GuitarString {
	const REGEX = new RegExp("^[1-6]$");

	if (isTrue(REGEX.test(stringNumber))) {
		return Number(stringNumber) as T_GuitarString;
	}

	throw new Error("Invalid guitar string");
}

export function parseBarre(input: string): T_GuitarString {
	if (isBarreChord(input)) {
		return Number(replaceAll(input, "x", "")) as T_GuitarString;
	}

	throw new Error("Invalid barre");
}

export function isBarreChord(guitarString: string): boolean {
	const REGEX = new RegExp("^[4-6]x$");

	return isTrue(REGEX.test(guitarString));
}

export function checkFingerValidity(value: T_Finger | undefined): boolean {
	if (!(typeof value === "number" && value >= 1 && value <= 4) && value !== undefined) {
		throw new Error(`Invalid finger (${value}). A finger must be between 1 and 4`);
	}

	return true;
}

export function checkGuitarStringValidity(value: number): boolean {
	if (Number.isNaN(value) || !(value >= 1 || value <= 6)) {
		throw new Error(`Invalid guitar string (${value}). A guitar string must be between 1 and 6`);
	}

	return true;
}

export function checkGuitarFretValidity(value: number): boolean {
	if (Number.isNaN(value) || !(value >= 1 || value <= 16)) {
		throw new Error(`Invalid guitar fret (${value}). A guitar fret must be between 1 and 16`);
	}

	return true;
}

export function checkTablatureSpaceValidity(value: number | "x"): boolean {
	if (
		(typeof value === "string" && value !== "x") ||
		(typeof value === "number" && (Number.isNaN(value) || !(value >= 1 || value <= 10)))
	) {
		throw new Error(
			`Invalid tablature space (${value}). A tablature space must be between 1 and 10 or should be "x"`,
		);
	}

	return true;
}

export function checkBarreChordValidity(value: number): boolean {
	return checkGuitarStringValidity(value);
}
