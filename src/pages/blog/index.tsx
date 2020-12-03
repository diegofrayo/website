import * as React from "react";
import Link from "next/link";

import { Page, MainLayout } from "~/components/layout";
import { blog as BlogEntries } from "~/data/blog/posts.json";
import { Routes } from "~/utils/constants";

function BlogPage(): any {
  return (
    <Page>
      <MainLayout
        breadcumb={[
          { text: "Inicio", url: Routes.HOME },
          { text: "Blog", url: Routes.BLOG() },
        ]}
        title="✍️ Blog"
      >
        <ul>
          {Object.values(BlogEntries).map(item => (
            <BlogEntry key={item.slug} {...item}></BlogEntry>
          ))}
        </ul>
      </MainLayout>
    </Page>
  );
}

export default BlogPage;

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
