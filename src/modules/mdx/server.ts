import fs from "fs";
import { bundleMDX } from "mdx-bundler";

export async function compile(config: { sourcePath: string } | { content: string }) {
	const result = await bundleMDX({
		source: "sourcePath" in config ? fs.readFileSync(config.sourcePath, "utf-8") : config.content,
	});

	return result;
}
