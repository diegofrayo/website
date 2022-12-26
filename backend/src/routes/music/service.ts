import DataManager from "~/modules/data-manager";

class MusicService {
	async get() {
		const data = await DataManager.query({ model: "music" });

		return data;
	}
}

export default new MusicService();
