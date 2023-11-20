// --- CHORDS ---

import type DR from "@diegofrayo/types";

export type T_Chord = {
	name: string;
	firstFret: T_GuitarFret;
	lastFret: T_GuitarFret;
	barreFret?:
		| {
				firstGuitarString: T_GuitarString;
				fret: T_GuitarFret;
		  }
		| undefined;
	touchedStrings: ("x" | "0" | "1")[];
	musicNotesGroupedByFret: Record<T_GuitarFret, T_MusicNote[]>;
};

export type T_PlainChord = T_PlainChordDetails | T_PlainChordDetails[];

export type T_PlainChordDetails = {
	name: string;
	musicNotes: string;
	touchedStrings: string;
	variantIndex: number;
};

export type T_ChordsDatabase = DR.Object<
	| {
			music_notes: string;
			touched_strings: string;
	  }
	| {
			music_notes: string;
			touched_strings: string;
	  }[]
>;

// --- MUSIC NOTE ---

export type T_MusicNote = {
	guitarString: T_GuitarString;
	guitarFret: T_GuitarFret;
	finger: T_Finger | undefined;
};

// --- MUSIC NOTES ELEMENTS ---

export type T_GuitarString = 1 | 2 | 3 | 4 | 5 | 6;
export type T_GuitarFret = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
export type T_Finger = 1 | 2 | 3 | 4;
