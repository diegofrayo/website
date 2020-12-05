import * as React from "react";
import Link from "next/link";

import { Page, MainLayout } from "~/components";
import { posts as BlogPosts } from "~/data/blog/posts.json";
import { getSiteTexts } from "~/i18n";
import { Routes, DEFAULT_LOCALE } from "~/utils/constants";

const SiteTexts = getSiteTexts({ page: Routes.BLOG(), layout: true });

function BlogPage(): any {
  return (
    <Page>
      <MainLayout
        breadcumb={[
          { text: SiteTexts.layout.breadcumb.home, url: Routes.HOME },
          { text: SiteTexts.layout.breadcumb.blog, url: Routes.BLOG() },
        ]}
        title={SiteTexts.page.title}
      >
        <ul>
          {Object.values(BlogPosts).map(item => {
            return (
              <BlogEntry
                key={item.slug}
                slug={item.slug}
                title={item[DEFAULT_LOCALE].title}
              ></BlogEntry>
            );
          })}
        </ul>
      </MainLayout>
    </Page>
  );
}

export default BlogPage;

// --- Components ---

function BlogEntry({ slug, title }) {
  return (
    <li className="tw-mb-4 sm:tw-mb-2">
      <Link href={`/blog/${slug}`}>
        <a className="hover:tw-opacity-75 tw-transition-opacity">
          <strong className="tw-text-black tw-text-xl">&#8227;</strong> {title}
        </a>
      </Link>
    </li>
  );
}
