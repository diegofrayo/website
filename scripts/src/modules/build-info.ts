import { writeFile } from "../../../src/lib/@diegofrayo/utils/files";

async function main() {
	writeFile("./src/data/build-info.json", { timestamp: new Date().getTime() });

	console.log(`"build-info" script executed successfully`);
}

main();
