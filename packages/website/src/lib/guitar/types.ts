export type T_Finger = 1 | 2 | 3 | 4;
export type T_GuitarFret = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
export type T_GuitarString = 1 | 2 | 3 | 4 | 5 | 6;
export type T_GuitarStringsToSkip = T_GuitarString[] | string;

// TODO: Review these types and their casting
interface I_MusicNoteBase {
  guitarFret: T_GuitarFret;
}

export interface I_SimpleMusicNote extends I_MusicNoteBase {
  guitarString: T_GuitarString;
  finger?: T_Finger;
}

export interface I_BarreMusicNote extends I_MusicNoteBase {
  barre: T_GuitarString;
}

export type T_MusicNote = I_SimpleMusicNote | I_BarreMusicNote;

export type T_GroupedMusicNotesByGuitarFret = Record<T_GuitarFret, T_MusicNote[]>;

export type T_ParsedChord = {
  firstFret: T_GuitarFret;
  lastFret: T_GuitarFret;
  musicNotesAsString: string;
  groupedMusicNotesByGuitarFret: T_GroupedMusicNotesByGuitarFret;
};

export type T_Chord = {
  name: string;
  musicNotes: string;
  stringsToSkip: string;
};