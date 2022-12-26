import fs from "fs";
import path from "path";

import { getByKey } from "~/utils/objects-and-arrays";
import { replaceAll } from "~/utils/strings";

import I_DataManager from "./Interface";
import { T_QueryConfigParam } from "./Types";

class StrategyWithFileSystem implements I_DataManager {
	query<G_Return>(config: T_QueryConfigParam): G_Return {
		const data = JSON.parse(
			fs.readFileSync(path.join(process.cwd(), `data/${config.model}.json`), "utf8"),
		);

		if (config.query) {
			return getByKey(data, replaceAll(config.query, "/", ".")) as G_Return;
		}

		return data as G_Return;
	}
}

export default StrategyWithFileSystem;
