import * as React from "react";
import Link from "next/link";

import { Page, MainLayout, UL } from "~/components";
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
        <UL>
          {Object.values(BlogPosts).map(item => {
            return (
              <BlogEntry
                key={item.slug}
                slug={item.slug}
                title={item[DEFAULT_LOCALE].title}
              ></BlogEntry>
            );
          })}
        </UL>
      </MainLayout>
    </Page>
  );
}

export default BlogPage;

// --- Components ---

function BlogEntry({ slug, title }) {
  return (
    <li>
      <Link href={`/blog/${slug}`}>
        <a className="hover:tw-opacity-75 tw-transition-opacity">{title}</a>
      </Link>
    </li>
  );
}
