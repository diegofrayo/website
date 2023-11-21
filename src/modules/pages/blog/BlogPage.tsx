import * as React from "react";

import { MainLayout, Page } from "~/components/layout";
import { Block, InlineText, Link, Text, Title } from "~/components/primitive";
import { ROUTES } from "~/modules/routing";
import type { T_PageContent } from "~/server/data-loader";

import { BlogPostCategory } from "./components";
import type { T_BlogPost } from "./types";

export type T_BlogPageProps = {
	cmsContent: T_PageContent;
	data: T_BlogPost[];
};

function BlogPage({ cmsContent, data: posts }: T_BlogPageProps) {
	return (
		<Page
			config={{
				title: cmsContent.content.seo.title,
				description: cmsContent.content.seo.description,
				disableSEO: cmsContent.config.is_seo_enabled === false,
				pathname: cmsContent.config.pathname,
			}}
		>
			<MainLayout title={cmsContent.content.seo.title}>
				{Object.values(posts).map((post) => {
					if (post.is_published === false) {
						return null;
					}

					return (
						<Link
							key={post.slug}
							href={`${ROUTES.BLOG}/${post.slug}`}
							variant={Link.variant.SIMPLE}
							className="tw-mb-10 tw-block last:tw-mb-0"
						>
							<Title
								variant={Title.variant.SIMPLE}
								is="h2"
								className="tw--mt-1.5 dr-text-color-primary-100"
								size={Title.size.LG}
							>
								{post.content.title}
							</Title>

							<Text className="tw-text-sm tw-text-white">
								<InlineText>Published at</InlineText>{" "}
								<InlineText is="strong">{post.published_at}</InlineText>
							</Text>
							<Text>{post.content.description}</Text>
							<Block>
								{post.categories.map((category) => {
									return <BlogPostCategory key={category}>{category}</BlogPostCategory>;
								})}
							</Block>
						</Link>
					);
				})}
			</MainLayout>
		</Page>
	);
}

export default BlogPage;
