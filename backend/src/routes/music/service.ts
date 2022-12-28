import DataManager from "~/modules/data-manager";

import { T_RawMusicResponse, T_RawMusicSongResponse } from "./models";

class MusicService {
	async get(): Promise<T_RawMusicResponse> {
		const data = await DataManager.query<T_RawMusicResponse>({ model: "music" });

		return data;
	}

	async findOne(songId: T_RawMusicSongResponse["id"]): Promise<T_RawMusicSongResponse> {
		const data = await DataManager.query<T_RawMusicSongResponse>({
			model: "music",
			query: `songs/${songId}`,
		});

		return data;
	}

	filterResults(rawMusicResponse: T_RawMusicResponse, isUserLoggedIn: boolean): T_RawMusicResponse {
		if (isUserLoggedIn) {
			return rawMusicResponse;
		}

		return {
			...rawMusicResponse,
			songs: Object.values(rawMusicResponse.songs).reduce((result, song) => {
				if (song.is_public) {
					return {
						...result,
						[song.id]: song,
					};
				}

				return result;
			}, {}),
		};
	}
}

export default new MusicService();
