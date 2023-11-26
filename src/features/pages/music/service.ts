import autoBind from "auto-bind";

import v from "~/lib/v";
import { transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/objects-and-arrays";
import type { T_Object } from "~/types";

class MusicServiceClass {
	constructor() {
		autoBind(this);
	}

	async fetchSongs(data: { songs: T_Song[] }): Promise<T_Song[]> {
		const songs = data.songs.map((song: T_Object) => SongVO(song));
		const chordsPage = songs.find((song) => this.isChordsSong(song));

		return (v.isUndefined(chordsPage) ? [] : [chordsPage]).concat(
			songs.filter((song) => this.isChordsSong(song) === false),
		);
	}

	async getSong(
		data: { songs: T_Song[] },
		criteria: Pick<T_Song, "id">,
	): Promise<T_Song | undefined> {
		const songs = await this.fetchSongs(data);
		const song = songs.find((item) => item.id === criteria.id);

		return song;
	}

	isChordsSong(song: T_Song): boolean {
		return song.id === "chords";
	}
}

const MusicService = new MusicServiceClass();

export default MusicService;

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
	readonly category: "0|IN_PROGRESS" | "1|FAVORITE" | "2|WELL_DONE" | "3|OK" | "4|TO_PRACTICE";
	readonly spotifyUrl: string;
	readonly youtubeUrl: string;
	readonly createdAt: string;
	readonly isPublic: boolean;
	readonly done: boolean;
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
