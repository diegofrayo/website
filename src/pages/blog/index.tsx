import * as React from "react";
import Link from "next/link";

import { Page, MainLayout, BlogDate } from "~/components";
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
    <li className="tw-mb-4 sm:tw-mb-2">
      <Link href={`/blog/${slug}`}>
        <a className="tw-block hover:tw-opacity-75 tw-transition-opacity tw-overflow-auto">
          <span className="tw-block sm:tw-inline-block">&#8227; {title}</span>
          <BlogDate className="tw-text-sm tw-float-right sm:tw-float-none tw-mt-1 sm:tw-mt-0 sm:tw-ml-2">
            {date}
          </BlogDate>
        </a>
      </Link>
    </li>
  );
}
