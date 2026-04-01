import {
	Box,
	Icon,
	IconCatalog,
	InlineText,
	Link,
	Text,
	Title,
} from "@diegofrayo-features/components/primitive";

import { MainLayout, Page } from "~/components/layout";
import { Routes } from "~/constants";

import { BlogPostCategory } from "./components/blog-post-category";
import type { BlogPosts } from "./types";

export type BlogPageProps = {
	data: BlogPosts;
};

function BlogPage({ data: posts }: BlogPageProps) {
	return (
		<Page
			config={{
				isSEOEnabled: metadata.is_seo_enabled === true,
				title: metadata.title,
				description: metadata.description,
				pathname: metadata.pathname,
			}}
		>
			<MainLayout title={metadata.title}>
				<Box className="mx-auto flex w-full max-w-lg flex-wrap gap-3">
					{Object.values(posts).map((post) => {
						if (post.is_published === false) return null;

						return (
							<Link
								key={post.slug}
								href={Routes.BLOG_POST(post.slug)}
								variant={Link.variant.SMOOTH}
								className="flex w-full shrink-0 flex-col justify-between rounded-sm border border-zinc-100 p-3 shadow-md"
							>
								<Box className="relative">
									<Title
										variant={Title.variant.SIMPLE}
										as="h2"
										className="leading-tight text-black"
									>
										{post.title}
									</Title>

									<Text className="pr-22 text-base">{post.description}</Text>

									<Box className="absolute right-0 bottom-0 mt-1 flex items-center justify-center gap-1 rounded bg-black px-1 py-0.5 pr-1.5 text-right text-xs text-white">
										<Icon
											icon={IconCatalog.CALENDAR}
											size={12}
										/>
										<InlineText as="strong">{post.published_at.split("/")[0]}</InlineText>
									</Box>
								</Box>

								<Box className="mt-6 hidden flex-wrap gap-1">
									{post.categories.map((category) => {
										return (
											<BlogPostCategory
												key={category}
												text={category}
											/>
										);
									})}
								</Box>
							</Link>
						);
					})}
				</Box>
			</MainLayout>
		</Page>
	);
}

export default BlogPage;

// --- CONSTANTS ---

const metadata = {
	title: "Blog",
	description:
		"In this blog, You will find out content about programming, mainly about frontend stuff, React, Next.js, MDX, Tailwind CSS, and other tools I used to build this website",
	is_seo_enabled: true,
	pathname: "/blog",
};
