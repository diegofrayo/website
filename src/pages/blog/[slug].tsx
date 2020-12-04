import * as React from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import { Page, MainLayout, BlogPostContent } from "~/components";
import * as MDXComponents from "~/components/MDXComponents";
import { blog as Posts } from "~/data/blog/posts.json";
import GithubData from "~/data/github.json";
import { Routes } from "~/utils/constants";

const MDXComponentsConfig = {
  ...MDXComponents,
  a: MDXComponents.Link,
};

function BlogPostPage({ post, content }: Record<string, any>): any {
  const mdxContent = hydrate(content, { components: MDXComponentsConfig });

  return (
    <Page>
      <MainLayout
        breadcumb={[
          { text: "Inicio", url: Routes.HOME },
          { text: "Blog", url: Routes.BLOG() },
          { text: post.title, url: Routes.BLOG(post.slug) },
        ]}
        title={post.title}
        blogMetadata={{ author: "@diegofrayo", date: post.date }}
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
  const content = await renderToString(note, {
    components: MDXComponentsConfig,
    scope: { github: GithubData },
  });

  return { props: { post, content }, revalidate: 1 };
}

export default BlogPostPage;
