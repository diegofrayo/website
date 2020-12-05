import * as React from "react";
import Link from "next/link";

import { Page, MainLayout, BlogDate } from "~/components";
import { blog as BlogEntries } from "~/data/blog/posts.json";
import { getSiteTexts } from "~/i18n";
import { Routes, DEFAULT_LOCALE } from "~/utils/constants";

const SiteTexts = getSiteTexts({ page: Routes.BLOG, layout: true });

function BlogPage(): any {
  return (
    <Page>
      <MainLayout
        breadcumb={[
          { text: SiteTexts.layout.breadcumb.home, url: Routes.HOME },
          { text: SiteTexts.layout.breadcumb.blog, url: Routes.BLOG() },
        ]}
        title={SiteTexts.title}
      >
        <ul>
          {Object.values(BlogEntries).map(item => {
            return (
              <BlogEntry
                key={item[DEFAULT_LOCALE].slug}
                date={item.date}
                slug={item[DEFAULT_LOCALE].slug}
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

function BlogEntry({ slug, title, date }) {
  return (
    <li className="tw-mb-4 sm:tw-mb-2">
      <Link href={`/blog/${slug}`}>
        <a className="tw-block hover:tw-opacity-75 tw-transition-opacity tw-overflow-auto">
          <span className="tw-block sm:tw-inline-block">
            <strong className="tw-text-black">&#8227;</strong> {title}
          </span>
          <BlogDate className="tw-float-right sm:tw-float-none tw-mt-1 sm:tw-mt-0 sm:tw-ml-2">
            {date}
          </BlogDate>
        </a>
      </Link>
    </li>
  );
}
