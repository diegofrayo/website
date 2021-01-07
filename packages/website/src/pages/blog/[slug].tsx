import * as React from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import { Page, MainLayout, MDXContent } from "~/components";
import { posts as BlogPosts } from "~/data/blog/posts.json";
import { WEBSITE_METADATA } from "~/data/metadata.json";
import Routes from "~/data/routes.json";
import { useInternationalization } from "~/hooks";
import { TypeBlogPost, TypeLocale, TypePagesRoutes } from "~/types";
import { getBlogPosts, getBlogTitle } from "~/utils/blog";
import { generateSupportedLocales, getItemLocale } from "~/utils/internationalization";
import { MDXComponentsConfig, MDXScope } from "~/utils/mdx";

type TypeBlogPostPageProps = {
  post: TypeBlogPost;
  content: any;
};

function BlogPostPage({ post, content }: TypeBlogPostPageProps): any {
  const { SiteTexts, currentLocale } = useInternationalization({
    page: Routes.BLOG as TypePagesRoutes,
    layout: true,
  });

  const mdxContent = hydrate(content, { components: MDXComponentsConfig });

  return (
    <Page
      config={{
        title: post[currentLocale]?.title,
        pathname: `${Routes.BLOG}/${post.slug}`,
        description: post[currentLocale]?.description,
        assets: ["blog_post"],
      }}
    >
      <MainLayout
        locales={generateSupportedLocales(post.locales, Routes.BLOG[post.slug])}
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: Routes.HOME as TypePagesRoutes,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.blog,
            url: Routes.BLOG as TypePagesRoutes,
          },
          {
            text: getBlogTitle(post, currentLocale),
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

// TODO: Next types
export async function getStaticPaths(): Promise<Record<string, any>> {
  return {
    paths: getBlogPosts().reduce((result, post: TypeBlogPost) => {
      return result.concat(
        post.locales.map((locale: TypeLocale) => {
          return { params: { slug: post.slug }, locale };
        }),
      );
    }, [] as Array<any>),
    fallback: false,
  };
}

// TODO: Next types
export async function getStaticProps({
  params,
  locale,
}: Record<string, any>): Promise<Record<string, any>> {
  const post: TypeBlogPost = BlogPosts[params.slug];
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
