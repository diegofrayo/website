import * as React from "react";
import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";
import fs from "fs";

import { Page } from "~/components/layout";
import { BlogContent } from "~/components/pages/_shared";
import { blog as Posts } from "~/data/blog/posts.json";

function BlogEntry({ post, content }: Record<string, any>): any {
  const mdxContent = hydrate(content);

  return (
    <Page>
      <div className="tw-flex tw-flex-col tw-h-full">
        <section className="tw-mx-auto tw-max-w-screen-md tw-w-full tw-flex-1 tw-overflow-auto tw-p-6">
          <h1 className="tw-text-3xl tw-text-gray-900 tw-mb-8">{post.title}</h1>
          <BlogContent content={mdxContent} />
        </section>
      </div>
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
