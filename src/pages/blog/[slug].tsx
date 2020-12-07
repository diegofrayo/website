import * as React from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import { Page, MainLayout, MDXContent } from "~/components";
import { posts as BlogPosts } from "~/data/blog/posts.json";
import { getSiteTexts } from "~/i18n";
import { Routes, DEFAULT_LOCALE } from "~/utils/constants";
import { MDXComponentsConfig, MDXScope } from "~/utils/mdx";

const SiteTexts = getSiteTexts({ page: Routes.BLOG(), layout: true });

function BlogPostPage({ post, content }: Record<string, any>): any {
  const mdxContent = hydrate(content, { components: MDXComponentsConfig });

  return (
    <Page metadata={{ title: post[DEFAULT_LOCALE].title }}>
      <MainLayout
        breadcumb={[
          { text: SiteTexts.layout.breadcumb.home, url: Routes.HOME },
          { text: SiteTexts.layout.breadcumb.blog, url: Routes.BLOG() },
          {
            text: post[DEFAULT_LOCALE].title,
            url: Routes.BLOG(post.slug),
          },
        ]}
        title={post[DEFAULT_LOCALE].title}
        blogMetadata={{
          author: "@diegofrayo",
          created_at: post.created_at,
          sourceURL: `${post.created_at}-${post.slug}`,
        }}
      >
        <MDXContent content={mdxContent} />
      </MainLayout>
    </Page>
  );
}

export async function getStaticPaths(): Promise<Record<string, any>> {
  return {
    paths: Object.keys(BlogPosts).map(slug => {
      return { params: { slug } };
    }),
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: Record<string, any>): Promise<Record<string, any>> {
  const post = BlogPosts[params.slug];
  const note = fs.readFileSync(
    `${process.cwd()}/src/data/blog/posts/${DEFAULT_LOCALE}/${post.created_at}-${
      post.slug
    }.mdx`,
    "utf8",
  );
  const content = await renderToString(note, {
    components: MDXComponentsConfig,
    scope: MDXScope,
  });

  return { props: { post, content } };
}

export default BlogPostPage;
