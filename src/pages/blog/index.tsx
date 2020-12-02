import * as React from "react";
import Link from "next/link";

import { Page } from "~/components/layout";

import { blog as BlogEntries } from "~/data/blog/posts.json";

function Blog(): any {
  return (
    <Page>
      <div className="tw-flex tw-flex-col tw-h-full">
        <section className="tw-mx-auto tw-max-w-screen-md tw-w-full tw-flex-1 tw-overflow-auto tw-p-6">
          <h1 className="tw-text-3xl tw-text-gray-900 tw-mb-8">Blog</h1>

          <ul>
            {Object.values(BlogEntries).map(item => (
              <BlogEntry key={item.slug} {...item}></BlogEntry>
            ))}
          </ul>
        </section>
      </div>
    </Page>
  );
}

// --- Components ---

function BlogEntry({ slug, title, date }) {
  return (
    <li>
      <Link href={`/blog/${slug}`}>
        <a className="hover:tw-opacity-75 tw-transition-opacity">
          - {title} | {date}
        </a>
      </Link>
    </li>
  );
}

export default Blog;
