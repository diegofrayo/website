import fs from "fs";
import pathNodeJs from "path";

export function dataFileLoader<G_Return>(path: string): G_Return {
	const data = fs.readFileSync(pathNodeJs.join(process.cwd(), "src/data/cms/", path), "utf8");

	if (path.endsWith(".json")) {
		return JSON.parse(data) as G_Return;
	}

	return data as G_Return;
}
