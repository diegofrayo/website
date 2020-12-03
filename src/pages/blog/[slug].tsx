import * as React from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import { Page, MainLayout } from "~/components/layout";
import BlogPostContent from "~/components/pages/blog-post/BlogPostContent";
import { blog as Posts } from "~/data/blog/posts.json";
import { Routes } from "~/utils/constants";
import * as BlogPostsComponents from "~/components/pages/blog-post/BlogPostsComponents";

function BlogPostPage({ post, content }: Record<string, any>): any {
  const mdxContent = hydrate(content, { components: BlogPostsComponents });

  return (
    <Page>
      <MainLayout
        breadcumb={[
          { text: "Inicio", url: Routes.HOME },
          { text: "Blog", url: Routes.BLOG() },
          { text: post.title, url: Routes.BLOG(post.slug) },
        ]}
        title={post.title}
      >
        <BlogPostContent content={mdxContent} />
      </MainLayout>
    </Page>
  );
}

export async function getStaticPaths(): Promise<Record<string, any>> {
  return {
    paths: Object.keys(Posts).map(slug => {
      return { params: { slug } };
    }),
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: Record<string, any>): Promise<Record<string, any>> {
  const post = Posts[params.slug];
  const note = fs.readFileSync(
    `${process.cwd()}/src/data/blog/content/${post.date}-${post.slug}.mdx`,
    "utf8",
  );
  const content = await renderToString(note, { components: BlogPostsComponents });

  return { props: { post, content }, revalidate: 1 };
}

export default BlogPostPage;
