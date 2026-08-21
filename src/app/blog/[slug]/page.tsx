import path from "path";
import { cache } from "react";
import type { Metadata } from "next";

import { readFile } from "@diegofrayo-pkg/utilities/files";

import { ASSETS_ROOT_PATH, WEBSITE_METADATA } from "~/constants";
import { compile } from "~/features/mdx/server";
import type { BlogPosts, BlogPostWithContent } from "~/features/pages/blog";
import BlogPostPage from "~/features/pages/blog/pages/[slug]";

type PageParams = {
	slug: string;
};

// --- METADATA ---

export async function generateMetadata({
	params,
}: {
	params: Promise<PageParams>;
}): Promise<Metadata> {
	const { slug } = await params;
	const post = getBlogPost(slug);

	return {
		title: post.details.title,
		description: post.details.description,
		robots: post.details.is_published ? undefined : { index: false, follow: false },
		alternates: { canonical: `/blog/${slug}` },
		openGraph: {
			type: "article",
			url: `/blog/${slug}`,
			siteName: WEBSITE_METADATA.title,
			images: `${ASSETS_ROOT_PATH}/meta-og-image.png`,
		},
	};
}

// --- COMPONENT DEFINITION ---

async function BlogPost({ params }: { params: Promise<PageParams> }) {
	const { slug } = await params;
	const post = getBlogPost(slug);
	const mdxCompiled = await compile({ content: post.content });

	return (
		<BlogPostPage
			data={{
				details: post.details,
				content: mdxCompiled.code,
			}}
		/>
	);
}

export default BlogPost;

// --- STATIC PARAMS ---

export async function generateStaticParams(): Promise<PageParams[]> {
	const posts = readFile<BlogPosts>(path.join(process.cwd(), "src/data/blog/posts.json"), "json");

	return Object.values(posts).map((post) => ({ slug: post.slug }));
}

// --- UTILS ---

const getBlogPost = cache(function getBlogPost(slug: string) {
	return readFile<BlogPostWithContent>(
		path.join(process.cwd(), `src/data/blog/posts/${slug}.json`),
		"json",
	);
});
