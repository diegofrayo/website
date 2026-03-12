import path from "path";
import type { GetStaticProps } from "next";

import { readFile } from "@diegofrayo-pkg/utilities/server/files";

import type { BlogPageProps } from "~/features/pages/blog";

export { default } from "~/features/pages/blog";

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
	const posts = await readFile<BlogPageProps["data"]>(
		path.join(process.cwd(), "src/data/blog/posts.json"),
		"json",
	);

	return {
		props: {
			data: posts,
		},
	};
};
