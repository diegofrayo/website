import fs from "fs";
import { bundleMDX } from "mdx-bundler";

export async function compile({ source }: { source: string }) {
	const mdxSource = fs.readFileSync(source, "utf-8");
	const result = await bundleMDX({ source: mdxSource });

	return result;
}
