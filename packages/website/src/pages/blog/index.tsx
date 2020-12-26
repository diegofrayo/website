import * as React from "react";
import NextLink from "next/link";

import { Page, MainLayout, UL, Link } from "~/components";
import { posts as BlogPosts } from "~/data/blog/posts.json";
import { Routes, CURRENT_LOCALE } from "~/utils/constants";
import { getDifferenceBetweenDates } from "~/utils/dates";
import { getSiteTexts } from "~/utils/i18n";
import { removeEmojiFromTitle } from "~/utils/misc";

const SiteTexts = getSiteTexts({ page: Routes.BLOG(), layout: true });

function BlogPage(): any {
  return (
    <Page
      config={{
        title: removeEmojiFromTitle(SiteTexts.page.current_locale.title),
        pathname: Routes.BLOG(),
        description: SiteTexts.page.current_locale.meta_description,
      }}
    >
      <MainLayout
        breadcumb={[
          { text: SiteTexts.layout.current_locale.breadcumb.home, url: Routes.HOME },
          { text: SiteTexts.layout.current_locale.breadcumb.blog, url: Routes.BLOG() },
        ]}
        title={SiteTexts.page.current_locale.title}
      >
        <p className="tw-mb-4">{SiteTexts.page.current_locale.description}</p>
        <UL>
          {Object.values(BlogPosts).map(item => {
            if (item.is_published === false) return null;

            return (
              <BlogEntry
                key={item.slug}
                slug={item.slug}
                updatedAt={item.updated_at}
                title={item[CURRENT_LOCALE].title}
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
        <span>{SiteTexts.page.current_locale.updated_at} </span>
        <strong>{getDifferenceBetweenDates(updatedAt, new Date())}</strong>
      </p>
    </li>
  );
}
