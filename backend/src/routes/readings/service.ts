import DataManager from "~/modules/data-manager";

import { T_RawReadingsResponse } from "./model";

class ReadingsService {
	async get(): Promise<T_RawReadingsResponse> {
		const data = await DataManager.query<T_RawReadingsResponse>({ model: "readings" });

		return data;
	}
}

export default new ReadingsService();
