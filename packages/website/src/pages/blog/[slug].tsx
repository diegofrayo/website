import * as React from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import { Page, MainLayout, MDXContent } from "~/components";
import { WEBSITE_METADATA } from "~/data/metadata";
import { posts as BlogPosts } from "~/data/blog/posts.json";
import { Routes, CURRENT_LOCALE } from "~/utils/constants";
import { getSiteTexts } from "~/utils/i18n";
import { MDXComponentsConfig, MDXScope } from "~/utils/mdx";

const SiteTexts = getSiteTexts({ page: Routes.BLOG(), layout: true });

function BlogPostPage({ post, content }: Record<string, any>): any {
  const mdxContent = hydrate(content, { components: MDXComponentsConfig });

  return (
    <Page
      config={{
        title: post[CURRENT_LOCALE].title,
        pathname: Routes.BLOG(post.slug),
        description: post[CURRENT_LOCALE].description,
        assets: ["blog_post"],
      }}
    >
      <MainLayout
        breadcumb={[
          { text: SiteTexts.layout.current_locale.breadcumb.home, url: Routes.HOME },
          { text: SiteTexts.layout.current_locale.breadcumb.blog, url: Routes.BLOG() },
          {
            text: post[CURRENT_LOCALE].title,
            url: Routes.BLOG(post.slug),
          },
        ]}
        title={post[CURRENT_LOCALE].title}
        blogMetadata={{
          author: `@${WEBSITE_METADATA.username}`,
          slug: post.slug,
          publishedAt: post.published_at,
          updatedAt: post.updated_at,
          createdAt: post.created_at,
        }}
      >
        <MDXContent content={mdxContent} />
      </MainLayout>
    </Page>
  );
}

export async function getStaticPaths(): Promise<Record<string, any>> {
  return {
    paths: Object.values(BlogPosts)
      .filter(item => item.is_published === true)
      .map(({ slug }) => {
        return { params: { slug } };
      }),
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: Record<string, any>): Promise<Record<string, any>> {
  const post = BlogPosts[params.slug];
  const language =
    post.languages.indexOf(CURRENT_LOCALE) !== -1 ? CURRENT_LOCALE : post.languages[0];
  const note = fs.readFileSync(
    `${process.cwd()}/src/data/blog/posts/${language}/${post.created_at}-${
      post.slug
    }.mdx`,
    "utf8",
  );
  const content = await renderToString(note, {
    components: MDXComponentsConfig,
    scope: { DATA: { ...MDXScope.DATA, blog_post: post } },
  });

  return { props: { post, content } };
}

export default BlogPostPage;
