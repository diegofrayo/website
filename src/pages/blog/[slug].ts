import path from "path";
import type { GetStaticPaths, GetStaticProps } from "next";

import { readFile } from "@diegofrayo-pkg/utilities/server/files";

import { compile } from "~/features/mdx/server";
import type { BlogPosts, BlogPostWithContent } from "~/features/pages/blog";
import type { BlogPostPageProps } from "~/features/pages/blog/pages/[slug]";

export { default } from "~/features/pages/blog/pages/[slug]";

// --- NEXT.JS FUNCTIONS ---

export const getStaticPaths: GetStaticPaths = async function getStaticPaths() {
	const posts = await readFile<BlogPosts>(
		path.join(process.cwd(), "src/data/blog/posts.json"),
		"json",
	);

	return {
		paths: Object.values(posts).map((post) => {
			return { params: { slug: post.slug } };
		}),
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps<BlogPostPageProps, { slug: string }> = async ({
	params,
}) => {
	const slug = params?.slug || "";
	if (!slug) throw new Error(`Invalid slug: "${slug}"`);

	const post = await readFile<BlogPostWithContent>(
		path.join(process.cwd(), `src/data/blog/posts/${slug}.json`),
		"json",
	);
	const mdxCompiled = await compile({ content: post.content });

	return {
		props: {
			data: {
				details: post.details,
				content: mdxCompiled.code,
			},
		},
	};
};
