import DataManager from "~/modules/data-manager";

import { T_RawMusicResponse, T_RawMusicSongResponse } from "./model";

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
}

export default new MusicService();
