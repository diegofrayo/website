import { bundleMDX } from "mdx-bundler";

import { readFile } from "@diegofrayo-pkg/utilities/files";

type CompileReturn = ReturnType<typeof bundleMDX>;

export async function compile(config: { sourcePath: string } | { content: string }): CompileReturn {
	const result = await bundleMDX({
		source: "sourcePath" in config ? readFile(config.sourcePath) : config.content,
	});

	return result;
}
