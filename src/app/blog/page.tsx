import path from "path";
import type { Metadata } from "next";

import { readFile } from "@diegofrayo-pkg/utilities/files";

import { ASSETS_ROOT_PATH, WEBSITE_METADATA } from "~/constants";
import BlogPage, { type BlogPageProps } from "~/features/pages/blog";

// --- METADATA ---

export const metadata: Metadata = {
	title: "Blog",
	description:
		"In this blog, You will find out content about programming, mainly about frontend stuff, React, Next.js, MDX, Tailwind CSS, and other tools I used to build this website",
	alternates: { canonical: "/blog" },
	openGraph: {
		type: "article",
		url: "/blog",
		siteName: WEBSITE_METADATA.title,
		images: `${ASSETS_ROOT_PATH}/meta-og-image.png`,
	},
};

// --- COMPONENT DEFINITION ---

function Blog() {
	const posts = readFile<BlogPageProps["data"]>(
		path.join(process.cwd(), "src/data/blog/posts.json"),
		"json",
	);

	return <BlogPage data={posts} />;
}

export default Blog;
