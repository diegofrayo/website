import fs from "fs";
import path from "path";

import IDataManager from "./Interface";

class StrategyWithFileSystem implements IDataManager {
	async query(config) {
		const posts = JSON.parse(
			fs.readFileSync(path.join(process.cwd(), `data/${config.model}.json`), "utf8"),
		);

		return posts;
	}
}

export default StrategyWithFileSystem;
