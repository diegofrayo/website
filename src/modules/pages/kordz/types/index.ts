import type { T_Song } from "@diegofrayo/types/kordz";

export type T_RawKordzResponse = T_Song[];

export type T_RawSongResponse = {
	details: T_Song;
	mdx: string;
	txt: string;
};
