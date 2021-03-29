import React, { Fragment } from "react";
import NextLink from "next/link";
import classnames from "classnames";

import { Page, MainLayout } from "~/components/layout";
import { UL, Link } from "~/components/primitive";
import { Render } from "~/components/shared";
import Routes from "~/data/routes.json";
import { useInternationalization, useQuery } from "~/hooks";
import BlogService from "~/services/blog";
import { TypeBlogPost, TypeLocale, TypePagesRoutes } from "~/types";
import { getDifferenceBetweenDates } from "~/utils/dates";
import { generateSupportedLocales, getItemLocale } from "~/utils/internationalization";
import { removeEmojiFromPageTitle } from "~/utils/strings";

function BlogPage(): any {
  const { SiteTexts, currentLocale } = useInternationalization({
    page: Routes.BLOG as TypePagesRoutes,
    layout: true,
  });

  const { isLoading, error, data } = useQuery("blogPosts", BlogService.fetchPosts);

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
            url: Routes.HOME as TypePagesRoutes,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.blog,
          },
        ]}
        title={SiteTexts.page.current_locale.title}
      >
        <Render isLoading={isLoading} error={error} data={data}>
          {data => {
            return (
              <UL>
                {data.map((post: TypeBlogPost) => {
                  const locale: TypeLocale = getItemLocale(
                    post.locales,
                    post.default_locale,
                    currentLocale,
                  );

                  return (
                    <BlogEntry
                      key={`BlogEntry-${post.slug}`}
                      slug={post.slug}
                      title={BlogService.composeTitle(post, locale)}
                      locale={locale}
                      categories={post[locale].categories}
                      updatedAt={post.updated_at}
                    />
                  );
                })}
              </UL>
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

function BlogEntry({ slug, title, locale, categories, updatedAt }: TypeBlogEntryProps): any {
  const { SiteTexts } = useInternationalization({
    page: Routes.BLOG as TypePagesRoutes,
    layout: true,
  });

  const CATEGORIES_COLORS = {
    1: "tw-bg-gray-200 dark:tw-bg-gray-600",
    2: "tw-bg-green-200 dark:tw-bg-green-600",
  };

  return (
    <Fragment>
      <Link
        is={NextLink}
        href={`${Routes.BLOG}/${slug}`}
        locale={locale}
        styled={false}
        className="tw-font-bold tw-text-black dark:tw-text-white"
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
              key={`category-${category.id}`}
              className={classnames(
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
