import { MainLayout, Page } from "~/components/layout";
import {
	Box,
	Icon,
	IconCatalog,
	Image,
	InlineText,
	Link,
	Text,
	Title,
} from "~/components/primitive";
import { Routes } from "~/constants";
import { BLOG_IMAGES_PATH } from "~/constants/assets";

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
				<Box className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{Object.values(posts).map((post) => {
						if (post.is_published === false) return null;

						return (
							<Link
								key={post.slug}
								href={Routes.BLOG_POST(post.slug)}
								variant={Link.variant.SMOOTH}
								className="mx-auto flex w-full max-w-lg flex-col overflow-hidden rounded-md border border-zinc-200 shadow-md"
							>
								<Image
									src={`${BLOG_IMAGES_PATH}/thumbnails/${post.slug}.png`}
									alt={post.title}
									className="h-auto w-full border-b border-zinc-200 bg-slate-50 object-cover sm:h-72 sm:object-contain"
									useNativeElement
								/>

								<Box className="flex flex-1 flex-col gap-2 p-3">
									<Title
										variant={Title.variant.SIMPLE}
										as="h2"
										size={Title.size.SM}
										className="leading-tight text-black"
									>
										{post.title}
									</Title>

									<Text className="text-sm text-zinc-600">{post.description}</Text>

									<Box className="mt-auto flex items-center gap-1 pt-2">
										<Icon
											icon={IconCatalog.CALENDAR}
											size={12}
										/>
										<InlineText className="text-xs text-zinc-500">
											{post.published_at.substring(0, 4)}
										</InlineText>
									</Box>

									<Box className="flex flex-wrap gap-1">
										{post.categories.map((category) => {
											return (
												<BlogPostCategory
													key={category}
													text={category}
												/>
											);
										})}
									</Box>
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
