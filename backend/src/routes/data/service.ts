import DataManager from "~/modules/data-manager";
import type { T_Object } from "~/types";

import { isPrivateModel } from "./utils";
import type { T_Model } from "./models";

class DataService {
	async findData(model: T_Model): Promise<T_Object> {
		const data = await DataManager.query<T_Object>({
			model: isPrivateModel(model) ? `/private/${model}` : model,
		});

		return data;
	}
}

export default new DataService();