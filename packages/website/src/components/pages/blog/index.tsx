import React from "react";
import classNames from "classnames";

import { Page, MainLayout } from "~/components/layout";
import { List, Link } from "~/components/primitive";
import { Render } from "~/components/pages/_shared";
import { useInternationalization, useQuery } from "~/hooks";
import BlogService from "~/services/blog";
import { T_BlogPost, T_BlogPostLocaleData, T_Locale, T_ReactElement } from "~/types";
import { getDifferenceBetweenDates } from "~/utils/dates";
import { generateSupportedLocales, getItemLocale } from "~/utils/internationalization";
import { Routes } from "~/utils/routing";
import { removeEmojiFromPageTitle } from "~/utils/strings";

function BlogPage(): T_ReactElement {
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
          {(data: T_BlogPost[]) => {
            return (
              <List>
                {data.map((post) => {
                  const locale: T_Locale = getItemLocale(
                    post.locales,
                    post.defaultLocale,
                    currentLocale,
                  );

                  return (
                    <BlogEntry
                      key={`BlogEntry-post-${post.slug}`}
                      slug={post.slug}
                      title={BlogService.composeTitle(post, locale)}
                      locale={locale}
                      categories={post[locale].categories}
                      updatedAt={post.updatedAt}
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

type T_BlogEntryProps = Pick<T_BlogPost, "slug" | "updatedAt"> &
  Pick<T_BlogPostLocaleData, "title" | "categories"> & {
    locale: T_Locale;
  };

function BlogEntry({
  slug,
  title,
  locale,
  categories,
  updatedAt,
}: T_BlogEntryProps): T_ReactElement {
  const { SiteTexts } = useInternationalization({
    page: Routes.BLOG,
    layout: true,
  });

  const CATEGORIES_COLORS = {
    1: "tw-bg-gray-200 dark:tw-bg-gray-600",
    2: "tw-bg-green-200 dark:tw-bg-green-600",
  };

  return (
    <List.Item>
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
      <div className="tw-pb-1">
        {categories.map((category) => {
          return (
            <span
              key={`BlogEntry-category-${category.id}`}
              className={classNames(
                "tw-inline-block tw-py-1 tw-px-2 tw-rounded-sm tw-font-semibold tw-text-xs",
                CATEGORIES_COLORS[category.id],
              )}
            >
              {category.value}
            </span>
          );
        })}
      </div>
    </List.Item>
  );
}
