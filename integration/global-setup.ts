import * as fs from "node:fs";
import * as path from "node:path";

import { readFile, writeFile } from "@diegofrayo-pkg/utilities/files";

import { compile } from "../src/features/mdx/server";

/**
 * NOTE: mdx-bundler relies on esbuild, which breaks when run inside the
 * jsdom test environment (its TextEncoder/Uint8Array realm differs from
 * Node's). globalSetup runs in the main Vitest process (plain Node,
 * no jsdom), so MDX posts are pre-compiled here and cached to disk for test
 * files to read synchronously.
 */

const FIXTURES_DIR = path.join(__dirname, ".fixtures");
const POST_SLUGS = ["sitios-para-visitar-en-el-quindio"];

export default async function setup(): Promise<void> {
	fs.mkdirSync(FIXTURES_DIR, { recursive: true });

	await Promise.all(
		POST_SLUGS.map(async (slug) => {
			const post = readFile(
				path.join(__dirname, `../src/data/blog/posts/${slug}.json`),
				"json",
			) as { content: string };
			const mdxCompiled = await compile({ content: post.content });

			writeFile(path.join(FIXTURES_DIR, `${slug}.json`), mdxCompiled.code);
		}),
	);
}
