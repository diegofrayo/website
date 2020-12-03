import * as React from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import { Page, MainLayout } from "~/components/layout";
import { Separator } from "~/components/primitive";
import { BlogContent, Breadcumb } from "~/components/pages/_shared";
import { blog as Posts } from "~/data/blog/posts.json";
import { Routes } from "~/utils/constants";

function BlogEntry({ post, content }: Record<string, any>): any {
  const mdxContent = hydrate(content);

  return (
    <Page>
      <MainLayout>
        <Breadcumb
          items={[
            { text: "Inicio", url: Routes.HOME },
            { text: "Blog", url: Routes.BLOG() },
            { text: post.title, url: Routes.BLOG(post.slug) },
          ]}
        />
        <Separator size={4}></Separator>
        <h1 className="tw-text-left tw-text-3xl tw-text-gray-900 tw-font-bold">
          {post.title}
        </h1>
        <Separator size={3}></Separator>
        <BlogContent content={mdxContent} />
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
  const content = await renderToString(note);

  return { props: { post, content }, revalidate: 1 };
}

export default BlogEntry;
