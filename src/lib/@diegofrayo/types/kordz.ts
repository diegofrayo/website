import type DR from "./index";

type T_SongBase = {
	readonly id: string;
	readonly title: string;
	artist: string;
	readonly album: string;
	readonly year: number;
	readonly country: string;
	readonly category: "0|IN_PROGRESS" | "1|FAVORITE" | "2|WELL_DONE" | "3|OK" | "4|TO_PRACTICE";
	readonly spotify_url: string;
	readonly youtube_url: string;
	readonly created_at: string;
	readonly is_public: boolean;
	readonly done: boolean;
	readonly order: number;
	readonly sources: {
		text: string;
		url: string;
		source: "youtube" | "lacuerda" | "url" | "instagram" | "spotify" | "ultimate-guitar";
	}[];
	readonly assets: DR.Object;
};

export type T_RawSong = T_SongBase & {
	readonly interpretation?: {
		"Fuerza del canto": string;
		"Velocidad de rasgueo": string;
		"Fuerza de rasgueo": string;
		Rasgueo: string;
		Complejidad: string;
	};
};

export type T_Song = T_SongBase & {
	readonly interpretation: string;
	readonly chords: string[];
};
