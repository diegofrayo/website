// --- Chords ---

export type T_Chord = {
	musicNotes: T_MusicNote[];
	frets: T_GuitarFret[];
	isBarreChord: boolean;
};

export type T_ParsedChord = {
	firstFret: T_GuitarFret;
	lastFret: T_GuitarFret;
	musicNotesGroupedByGuitarFret: T_MusicNotesGroupedByGuitarFret;
};

export type T_ChordsDatabase = {
	[key in string]: T_RawChord;
};

export type T_RawChord = T_RawChordDetails | T_RawChordDetails[];

type T_RawChordDetails = {
	music_notes: string;
	played_strings: string;
};

export type T_PreparsedChord = T_PreparsedChordDetails | T_PreparsedChordDetails[];

export type T_PreparsedChordDetails = {
	name: string;
	musicNotes: string;
	touchedStrings: string;
	variantIndex?: number;
};

export type T_ChordTouchedStrings = string;

// --- Music note ---

interface I_MusicNoteBase {
	guitarFret: T_GuitarFret;
}

export interface I_SimpleMusicNote extends I_MusicNoteBase {
	guitarString: T_GuitarString;
	finger: T_Finger | undefined;
}

export interface I_BarreMusicNote extends I_MusicNoteBase {
	barre: T_GuitarString;
}

export type T_MusicNote = I_SimpleMusicNote | I_BarreMusicNote;

// --- Music notes elements ---

export type T_GuitarString = 1 | 2 | 3 | 4 | 5 | 6;
export type T_GuitarFret = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
export type T_Finger = 1 | 2 | 3 | 4;

// --- IDK ---

export type T_MusicNotesGroupedByGuitarFret = Record<T_GuitarFret, T_MusicNote[]>;
