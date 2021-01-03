import * as React from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import { Page, MainLayout, MDXContent } from "~/components";
import { posts as BlogPosts } from "~/data/blog/posts.json";
import { WEBSITE_METADATA } from "~/data/metadata.json";
import Routes from "~/data/routes.json";
import { useInternationalization } from "~/hooks";
import { getBlogPosts, getBlogTitle } from "~/utils/blog";
import { generateSupportedLocales, getItemLocale } from "~/utils/internationalization";
import { MDXComponentsConfig, MDXScope } from "~/utils/mdx";
import { TypeBlogPost } from "~/types";

function BlogPostPage({ post, content }: Record<string, any>): any {
  const { SiteTexts, currentLocale } = useInternationalization({
    page: Routes.BLOG,
    layout: true,
  });

  const mdxContent = hydrate(content, { components: MDXComponentsConfig });

  return (
    <Page
      config={{
        title: post[currentLocale].title,
        pathname: Routes.BLOG_POSTS[post.slug],
        description: post[currentLocale].description,
        assets: ["blog_post"],
      }}
    >
      <MainLayout
        locales={generateSupportedLocales(post.locales, Routes.BLOG_POSTS[post.slug])}
        breadcumb={[
          { text: SiteTexts.layout.current_locale.breadcumb.home, url: Routes.HOME },
          { text: SiteTexts.layout.current_locale.breadcumb.blog, url: Routes.BLOG },
          {
            text: getBlogTitle(post, currentLocale),
            url: Routes.BLOG_POSTS[post.slug],
          },
        ]}
        title={getBlogTitle(post, currentLocale)}
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
    paths: getBlogPosts().reduce((result, post: TypeBlogPost) => {
      return result.concat(
        post.locales.map(locale => {
          return { params: { slug: post.slug }, locale };
        }),
      );
    }, []),
    fallback: false,
  };
}

export async function getStaticProps({
  params,
  locale,
}: Record<string, any>): Promise<Record<string, any>> {
  const post = BlogPosts[params.slug];
  const note = fs.readFileSync(
    `${process.cwd()}/src/data/blog/posts/${getItemLocale(
      post.locales,
      post.default_locale,
      locale,
    )}/${post.created_at}-${post.slug}.mdx`,
    "utf8",
  );
  const content = await renderToString(note, {
    components: MDXComponentsConfig,
    scope: { DATA: { ...MDXScope.DATA, blog_post: post } },
  });

  return { props: { post, content } };
}

export default BlogPostPage;
