import React, { Fragment } from "react";
import classNames from "classnames";

import { Page, MainLayout } from "~/components/layout";
import { List, Link } from "~/components/primitive";
import { Render } from "~/components/pages/_shared";
import { useInternationalization, useQuery } from "~/hooks";
import BlogService from "~/services/blog";
import { TypeBlogPost, TypeLocale } from "~/types";
import { getDifferenceBetweenDates } from "~/utils/dates";
import { generateSupportedLocales, getItemLocale } from "~/utils/internationalization";
import { Routes } from "~/utils/routing";
import { removeEmojiFromPageTitle } from "~/utils/strings";

function BlogPage(): any {
  const { isLoading, error, data } = useQuery("blogPosts", BlogService.fetchPosts);
  const { SiteTexts, currentLocale } = useInternationalization({
    page: Routes.BLOG,
    layout: true,
  });

  return (
    <Page
      config={{
        title: removeEmojiFromPageTitle(SiteTexts.page.current_locale.title),
        pathname: Routes.BLOG,
        description: SiteTexts.page.current_locale.meta_description,
      }}
    >
      <MainLayout
        locales={generateSupportedLocales(SiteTexts.page.config.locales, Routes.BLOG)}
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: Routes.HOME,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.blog,
          },
        ]}
        title={SiteTexts.page.current_locale.title}
      >
        <Render isLoading={isLoading} error={error} data={data}>
          {(data: TypeBlogPost[]) => {
            return (
              <List>
                {data.map(post => {
                  const locale: TypeLocale = getItemLocale(
                    post.locales,
                    post.default_locale,
                    currentLocale,
                  );

                  return (
                    <BlogEntry
                      key={`BlogEntry-post-${post.slug}`}
                      slug={post.slug}
                      title={BlogService.composeTitle(post, locale)}
                      locale={locale}
                      categories={post[locale].categories}
                      updatedAt={post.updated_at}
                    />
                  );
                })}
              </List>
            );
          }}
        </Render>
      </MainLayout>
    </Page>
  );
}

export default BlogPage;

// --- Components ---

// TODO: Reuse TypeBlogPosts
type TypeBlogEntryProps = {
  slug: string;
  title: string;
  locale: TypeLocale;
  categories: [{ id: number; value: string }];
  updatedAt: string;
};

function BlogEntry({
  slug,
  title,
  locale,
  categories,
  updatedAt,
}: TypeBlogEntryProps): JSX.Element {
  const { SiteTexts } = useInternationalization({
    page: Routes.BLOG,
    layout: true,
  });

  const CATEGORIES_COLORS = {
    1: "tw-bg-gray-200 dark:tw-bg-gray-600",
    2: "tw-bg-green-200 dark:tw-bg-green-600",
  };

  return (
    <Fragment>
      <Link
        href={`${Routes.BLOG}/${slug}`}
        locale={locale}
        variant={Link.variant.SECONDARY}
        className="tw-font-bold"
        isNextLink
      >
        {title}
      </Link>
      <p className="tw-text-sm tw-italic">
        <span>{SiteTexts.page.current_locale.updated_at} </span>
        <strong>{getDifferenceBetweenDates(updatedAt, new Date())}</strong>
      </p>
      <p className="tw-text-xs tw-my-2">
        {categories.map(category => {
          return (
            <span
              key={`BlogEntry-category-${category.id}`}
              className={classNames(
                "tw-py-1 tw-px-2 tw-rounded-sm tw-font-semibold",
                CATEGORIES_COLORS[category.id],
              )}
            >
              {category.value}
            </span>
          );
        })}
      </p>
    </Fragment>
  );
}
