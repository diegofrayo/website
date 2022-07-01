import http from "~/lib/http";
import { ENV_VARS } from "~/utils/constants";
import {
	sortBy,
	transformObjectKeysFromSnakeCaseToLowerCamelCase,
} from "~/utils/objects-and-arrays";
import { isUndefined } from "~/utils/validations";
import type { T_UnknownObject } from "~/types";

class MusicService {
	constructor() {
		this.fetchSongs = this.fetchSongs.bind(this);
		this.getSong = this.getSong.bind(this);
	}

	async fetchSongs(): Promise<T_Song[]> {
		const songs = (await this.fetchData()).map((song: T_UnknownObject) => SongVO(song));
		const chordsPage = songs.find((song) => this.isChordsSong(song));

		return (isUndefined(chordsPage) ? [] : [chordsPage]).concat(
			songs
				.filter((song) => this.isChordsSong(song) === false)
				.sort(
					sortBy([
						{ param: "category", order: "asc" },
						{ param: "order", order: "desc" },
						{ param: "title", order: "asc" },
					]),
				),
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

	private async fetchData(): Promise<T_UnknownObject[]> {
		const { data } = await http.post(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
			path: "/data",
			model: "music",
		});

		return data.songs;
	}
}

export default new MusicService();

// --- Value objects ---

function SongVO(data: T_UnknownObject): T_Song {
	const song = transformObjectKeysFromSnakeCaseToLowerCamelCase<T_Song>(data);

	song.artist = Array.isArray(song.artist) ? song.artist.join(", ") : song.artist;
	song.chords = song.chords.sort();
	song.sources = (song.sources || []).sort(
		sortBy([
			{ param: "order", order: "asc" },
			{ param: "title", order: "asc" },
		]),
	);

	return song;
}

// --- Types ---

export type T_Song = {
	readonly id: string;
	readonly title: string;
	artist: string;
	readonly album: string;
	readonly year: number;
	readonly country: string;
	readonly category:
		| "0|IN_PROGRESS"
		| "1|DONE"
		| "2|TO_PRACTICE"
		| "3|SOME_DAY"
		| "4|NO_SING"
		| "5|ABANDONED";
	readonly spotifyUrl: string;
	readonly youtubeUrl: string;
	readonly createdAt: string;
	readonly isPublic: boolean;
	sources: {
		order: number;
		text: string;
		url: string;
		source: "youtube" | "lacuerda" | "url" | "instagram" | "spotify" | "ultimate-guitar";
	}[];
	chords: string[];
	readonly assets: {
		serverUrl?: string;
	};
};
