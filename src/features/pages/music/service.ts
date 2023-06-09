import autoBind from "auto-bind";

import { ENV_VARS } from "~/constants";
import http from "~/lib/http";
import v from "~/lib/v";
import { transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/objects-and-arrays";
import type { T_Object } from "~/types";

class MusicService {
	constructor() {
		autoBind(this);
	}

	async fetchSongs(): Promise<T_Song[]> {
		const songs = (await this.fetchData()).map((song: T_Object) => SongVO(song));
		const chordsPage = songs.find((song) => this.isChordsSong(song));

		return (v.isUndefined(chordsPage) ? [] : [chordsPage]).concat(
			songs.filter((song) => this.isChordsSong(song) === false),
		);
	}

	async getSong(criteria: Pick<T_Song, "id">): Promise<T_Song | undefined> {
		const songs = await this.fetchSongs();
		const song = songs.find((item) => item.id === criteria.id);

		return song;
	}

	isChordsSong(song: T_Song): boolean {
		return song.id === "chords";
	}

	private async fetchData(): Promise<T_Object[]> {
		const { data } = await http.post(
			`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`,
			{
				path: "/data",
				model: "music",
			},
			{
				headers: {
					"dfr-local-cache": "DFR_MUSIC",
				},
			},
		);

		return data.songs;
	}
}

export default new MusicService();

// --- VALUE OBJECTS ---

function SongVO(data: T_Object): T_Song {
	const song = transformObjectKeysFromSnakeCaseToLowerCamelCase<T_Song>(data);

	song.artist = Array.isArray(song.artist) ? song.artist.join(", ") : song.artist;
	song.sources = song.sources || [];

	return song;
}

// --- TYPES ---

export type T_Song = {
	readonly id: string;
	readonly title: string;
	artist: string;
	readonly album: string;
	readonly year: number;
	readonly country: string;
	readonly category:
		| "0|IN_PROGRESS"
		| "1|FAVORITE"
		| "2|WELL_DONE"
		| "3|TO_PRACTICE"
		| "4|SOME_DAY";
	readonly spotifyUrl: string;
	readonly youtubeUrl: string;
	readonly createdAt: string;
	readonly isPublic: boolean;
	sources: {
		text: string;
		url: string;
		source: "youtube" | "lacuerda" | "url" | "instagram" | "spotify" | "ultimate-guitar";
	}[];
	chords: string[];
	readonly interpretation?: string;
	readonly assets: {
		serverUrl: string;
	};
};
