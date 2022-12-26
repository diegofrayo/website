import { isTrue } from "~/utils/validations";

import { T_GuitarFret, T_GuitarString } from "./types";

export const NUMBER_OF_STRINGS = 6;

export function parseGuitarString(stringNumber: string | number): T_GuitarString {
	const REGEX = /^[1-6]$/;

	if (isTrue(REGEX.test(String(stringNumber)))) {
		return Number(stringNumber) as T_GuitarString;
	}

	throw new Error("Invalid guitar string");
}

export function parseFret(fret: string | number): T_GuitarFret {
	const REGEX = /^(^[1-9]{1}|^1[0-6]{1})$/;

	if (isTrue(REGEX.test(String(fret)))) {
		return Number(fret) as T_GuitarFret;
	}

	throw new Error("Invalid guitar fret");
}
