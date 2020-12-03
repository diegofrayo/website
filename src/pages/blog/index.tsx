import * as React from "react";
import Link from "next/link";

import { Page, MainLayout } from "~/components/layout";
import { Separator } from "~/components/primitive";
import { Breadcumb } from "~/components/pages/_shared";
import { blog as BlogEntries } from "~/data/blog/posts.json";
import { Routes } from "~/utils/constants";

function Blog(): any {
  return (
    <Page>
      <MainLayout>
        <Breadcumb
          items={[
            { text: "Inicio", url: Routes.HOME },
            { text: "Blog", url: Routes.BLOG() },
          ]}
        />
        <Separator size={4}></Separator>
        <h1 className="tw-text-left tw-text-3xl tw-text-gray-900 tw-font-bold">
          ✍️ Blog
        </h1>
        <Separator size={3}></Separator>
        <ul>
          {Object.values(BlogEntries).map(item => (
            <BlogEntry key={item.slug} {...item}></BlogEntry>
          ))}
        </ul>
      </MainLayout>
    </Page>
  );
}

// --- Components ---

function BlogEntry({ slug, title, date }) {
  return (
    <li className="tw-list-disc tw-list-inside">
      <Link href={`/blog/${slug}`}>
        <a className="hover:tw-opacity-75 tw-transition-opacity">
          <span>{title}</span>
          <span className="tw-bg-gray-200 tw-text-sm tw-p-1 tw-rounded-md tw-mx-2 tw-text-gray-600 tw-font-bold">
            🗓️ {date}
          </span>
        </a>
      </Link>
    </li>
  );
}

export default Blog;
