// --- Chords ---

export type T_Chord = {
	firstFret: T_GuitarFret;
	lastFret: T_GuitarFret;
	barreFret: T_BarreFret | undefined;
	isBarreChord: boolean;
	musicNotesGroupedByFret: Record<T_GuitarFret, T_MusicNote[]>;
};

export type T_MusicNotesGroupedByFret = Record<T_GuitarFret, T_MusicNote[]>;

export type T_UnparsedChord =
	| T_UnparsedChordDetails
	| {
			name: T_UnparsedChordDetails["name"];
			variants: T_UnparsedChordDetails[];
	  };

export type T_UnparsedChordDetails = {
	name: string;
	musicNotes: string;
	touchedStrings: string;
	variantIndex?: number;
};

export type T_BarreFret = {
	firstGuitarString: T_GuitarString;
	fret: T_GuitarFret;
};

// --- Music note ---

export type T_MusicNote = {
	guitarString: T_GuitarString;
	guitarFret: T_GuitarFret;
	finger: T_Finger | undefined;
};

// --- Music notes elements ---

export type T_GuitarString = 1 | 2 | 3 | 4 | 5 | 6;
export type T_GuitarFret = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
export type T_Finger = 1 | 2 | 3 | 4;

// --- TODO: Refactor this fuckking shit ---

// export type T_Chord = {
// 	musicNotes: T_MusicNote[];
// 	frets: T_GuitarFret[];
// 	isBarreChord: boolean;
// };

export type T_ChordsDatabase = {
	[key in string]: T_RawChord;
};

export type T_RawChord = T_RawChordDetails | T_RawChordDetails[];

type T_RawChordDetails = {
	music_notes: string;
	touched_strings: string;
};

export type T_PreparsedChord = T_PreparsedChordDetails | T_PreparsedChordDetails[];

export type T_PreparsedChordDetails = {
	name: string;
	musicNotes: string;
	touchedStrings: string;
	variantIndex?: number;
};

export type T_ChordTouchedStrings = string;
