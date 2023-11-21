import type { T_Song } from "@diegofrayo/types/kordz";

export function isChordsSong(song: T_Song) {
	return song.id === "chords";
}
