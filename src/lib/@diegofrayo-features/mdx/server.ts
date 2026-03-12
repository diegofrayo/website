import { bundleMDX } from "mdx-bundler";

import { readFile } from "@diegofrayo-pkg/utilities/server/files";

export async function compile(config: { sourcePath: string } | { content: string }) {
	const result = await bundleMDX({
		source: "sourcePath" in config ? readFile(config.sourcePath) : config.content,
	});

	return result;
}
