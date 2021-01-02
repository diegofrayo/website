import * as React from "react";
import NextLink from "next/link";

import { Page, MainLayout, UL, Link } from "~/components";
import { posts as BlogPosts } from "~/data/blog/posts.json";
import Routes from "~/data/routes.json";
import { useInternationalization } from "~/hooks";
import { getDifferenceBetweenDates } from "~/utils/dates";
import { generateSupportedLocales, getItemLocale } from "~/utils/internationalization";
import { getBlogTitle, removeEmojiFromTitle } from "~/utils/misc";

function BlogPage(): any {
  const { SiteTexts, currentLocale } = useInternationalization({
    page: Routes.BLOG,
    layout: true,
  });

  function sortBlogPostsByPublishedDate(a, b) {
    if (a.published_at > b.published_at) {
      return -1;
    }

    if (a.published_at < b.published_at) {
      return 1;
    }

    return 0;
  }

  return (
    <Page
      config={{
        title: removeEmojiFromTitle(SiteTexts.page.current_locale.title),
        pathname: Routes.BLOG,
        description: SiteTexts.page.current_locale.meta_description,
      }}
    >
      <MainLayout
        locales={generateSupportedLocales(SiteTexts.page.config.locales, Routes.BLOG)}
        breadcumb={[
          { text: SiteTexts.layout.current_locale.breadcumb.home, url: Routes.HOME },
          { text: SiteTexts.layout.current_locale.breadcumb.blog, url: Routes.BLOG },
        ]}
        title={SiteTexts.page.current_locale.title}
      >
        <p className="tw-mb-4">{SiteTexts.page.current_locale.description}</p>
        <UL>
          {Object.values(BlogPosts)
            .sort(sortBlogPostsByPublishedDate)
            .map(post => {
              if (post.is_published === false) return null;

              const locale = getItemLocale(
                post.locales,
                post.default_locale,
                currentLocale,
              );

              return (
                <BlogEntry
                  key={post.slug}
                  slug={post.slug}
                  updatedAt={post.updated_at}
                  title={getBlogTitle(post, locale)}
                  locale={locale}
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

function BlogEntry({ slug, title, locale, updatedAt }) {
  const { SiteTexts } = useInternationalization({ page: Routes.BLOG, layout: true });

  return (
    <li>
      <Link is={NextLink} href={Routes.BLOG_POSTS[slug]} locale={locale}>
        {title}
      </Link>
      <p className="tw-text-sm tw-ml-4 tw-italic">
        <span>{SiteTexts.page.current_locale.updated_at} </span>
        <strong>{getDifferenceBetweenDates(updatedAt, new Date())}</strong>
      </p>
    </li>
  );
}
