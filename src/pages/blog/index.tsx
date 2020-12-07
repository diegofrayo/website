import * as React from "react";
import NextLink from "next/link";

import { Page, MainLayout, UL, Link } from "~/components";
import { posts as BlogPosts } from "~/data/blog/posts.json";
import { getSiteTexts } from "~/i18n";
import { Routes, DEFAULT_LOCALE } from "~/utils/constants";
import { getDifferenceBetweenDates } from "~/utils/dates";
import { removeEmojiFromTitle } from "~/utils/misc";

const SiteTexts = getSiteTexts({ page: Routes.BLOG(), layout: true });

function BlogPage(): any {
  return (
    <Page metadata={{ title: removeEmojiFromTitle(SiteTexts.page.title) }}>
      <MainLayout
        breadcumb={[
          { text: SiteTexts.layout.breadcumb.home, url: Routes.HOME },
          { text: SiteTexts.layout.breadcumb.blog, url: Routes.BLOG() },
        ]}
        title={SiteTexts.page.title}
      >
        <p className="tw-mb-4">{SiteTexts.page.description}</p>
        <UL>
          {Object.values(BlogPosts).map(item => {
            return (
              <BlogEntry
                key={item.slug}
                slug={item.slug}
                updatedAt={item.updated_at}
                title={item[DEFAULT_LOCALE].title}
              />
            );
          })}
        </UL>
      </MainLayout>
    </Page>
  );
}

export default BlogPage;

// --- Components ---

function BlogEntry({ slug, title, updatedAt }) {
  return (
    <li>
      <Link is={NextLink} href={Routes.BLOG(slug)}>
        {title}
      </Link>
      <p className="tw-text-sm tw-ml-4 tw-italic">
        <span>{SiteTexts.page.updated_at} </span>
        <strong>{getDifferenceBetweenDates(updatedAt, new Date())}</strong>
      </p>
    </li>
  );
}
