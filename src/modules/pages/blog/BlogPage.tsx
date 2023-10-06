import * as React from "react";

import { MainLayout, Page } from "~/components/layout";
import { Block, InlineText, Link, Space, Text, Title } from "~/components/primitive";
import { ROUTES } from "~/modules/routing";
import type { T_PageContent } from "~/data/loader";

import { BlogPostCategory } from "./components";
import type { T_BlogPost } from "./types";

export type T_BlogPageProps = {
	content: T_PageContent;
	data: T_BlogPost[];
};

function BlogPage({ content, data: posts }: T_BlogPageProps) {
	return (
		<Page
			config={{
				title: content.content.seo.title,
				description: content.content.seo.description,
				disableSEO: content.config.is_seo_enabled === false,
				pathname: content.config.pathname,
			}}
		>
			<MainLayout title={content.content.seo.title}>
				{Object.values(posts).map((post) => {
					return (
						<Link
							key={post.config.slug}
							href={`${ROUTES.BLOG}/${post.config.slug}`}
							variant={Link.variant.SIMPLE}
							className="tw-mb-6 tw-block tw-border-l-8 tw-border-t tw-pl-2 dr-border-t-color-surface-100 dr-border-l-color-surface-300 last:tw-mb-0"
						>
							<Title
								is="h2"
								className="tw--mt-1.5 dr-text-color-primary-100"
								size={Title.size.MD}
							>
								{post.content.title}
							</Title>
							<Space size={0.5} />

							<Text className="tw-text-sm dr-text-color-surface-500">
								<InlineText>Published at</InlineText>{" "}
								<InlineText is="strong">{post.config.published_at}</InlineText>
							</Text>
							<Space size={0.5} />
							<Text>{post.content.description}</Text>
							<Block>
								{post.config.categories.map((category) => {
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
