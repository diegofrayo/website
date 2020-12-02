import * as React from "react";
import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";
import fs from "fs";

import { Page } from "~/components/layout";

import { blog as BlogEntries } from "~/data/blog/posts.json";

function BlogEntry({ content, post }: Record<string, any>): any {
  const mdxContent = hydrate(content);

  return (
    <Page>
      <div className="tw-flex tw-flex-col tw-h-full">
        <section className="tw-mx-auto tw-max-w-screen-md tw-w-full tw-flex-1 tw-overflow-auto tw-p-6">
          <h1 className="tw-text-3xl tw-text-gray-900 tw-mb-8">{post.title}</h1>
          <article>{mdxContent}</article>
        </section>
      </div>
    </Page>
  );
}

export async function getStaticProps({
  params,
}: Record<string, any>): Promise<Record<string, any>> {
  const blogPost = BlogEntries[params.slug];
  let note = "";

  try {
    note = fs.readFileSync(
      `${process.cwd()}/public/static/blog/${blogPost.date}-${blogPost.slug}.mdx`,
      "utf8",
    );
  } catch (error) {
    console.log(error);
    note = "No se pudo cargar el contenido";
  }

  const content = await renderToString(note);

  return { props: { post: blogPost, content }, revalidate: 1 };
}

export async function getStaticPaths(): Promise<Record<string, any>> {
  return {
    paths: Object.keys(BlogEntries).map(slug => {
      return { params: { slug } };
    }),
    fallback: false,
  };
}

export default BlogEntry;
