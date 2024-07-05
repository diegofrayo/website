import type DR from "./index";

type T_SongBase = {
	readonly id: string;
	readonly title: string;
	readonly artist: string;
	readonly album: string;
	readonly year: number;
	readonly country: string;
	readonly category:
		| "0|IN_PROGRESS|🚧"
		| "1|FAVORITE|⭐"
		| "2|WELL_DONE|👌"
		| "3|SOCIAL|🎶"
		| "4|CHECKED|☑️"
		| "5|REVIEW|🕵️"
		| "6|ARCHIVED|🗃️";
	readonly spotify_url: string;
	readonly youtube_url: string;
	readonly created_at: string;
	readonly is_public: boolean;
	readonly done: boolean;
	readonly sources: {
		text: string;
		url: string;
		source: "youtube" | "lacuerda" | "url" | "instagram" | "spotify" | "ultimate-guitar";
	}[];
	readonly assets: DR.Object;
};

export type T_RawSong = T_SongBase;

export type T_Song = T_SongBase & {
	readonly chords: string[];
};
