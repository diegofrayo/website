import React from "react";
import classNames from "classnames";
import { useRouter } from "next/router";

import { Page, MainLayout } from "~/components/layout";
import { List, Link, Block } from "~/components/primitive";
import { Render } from "~/components/pages/_shared";
import { useQuery } from "~/hooks";
import { useTranslation, getPageContentStaticProps } from "~/i18n";
import BlogService from "~/services/blog";
import { T_BlogPost, T_Locale, T_ReactElement } from "~/types";
import { getDifferenceBetweenDates } from "~/utils/dates";
import { ROUTES } from "~/utils/routing";

function BlogPage(): T_ReactElement {
  const { isLoading, error, data } = useQuery("blogPosts", BlogService.fetchPosts);
  const { t } = useTranslation();

  return (
    <Page
      config={{
        title: t("seo:title"),
        description: t("seo:description"),
        pathname: ROUTES.BLOG,
        disableSEO: Boolean(t("page:config:is_seo_disabled")),
      }}
    >
      <MainLayout title={t("seo:title")}>
        <Render isLoading={isLoading} error={error} data={data}>
          {(posts: T_BlogPost[]) => {
            return (
              <List>
                {posts.map((post) => {
                  return (
                    <BlogEntry
                      key={post.slug}
                      slug={post.slug}
                      title={post.title}
                      categories={post.categories}
                      updatedAt={post.updatedAt}
                      locales={post.locales}
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

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.BLOG,
});

// --- Components ---

type T_BlogEntryProps = Pick<T_BlogPost, "title" | "categories" | "slug" | "updatedAt" | "locales">;

function BlogEntry({
  slug,
  title,
  categories,
  updatedAt,
  locales,
}: T_BlogEntryProps): T_ReactElement {
  const { t } = useTranslation();
  const { locale } = useRouter();

  const CATEGORIES_COLORS = {
    tech: "tw-bg-green-200 dark:tw-bg-green-400 tw-text-black tw-opacity-75",
    personal: "tw-bg-blue-200 dark:tw-bg-blue-400 tw-text-black tw-opacity-75",
  };

  function getLocale(): T_Locale {
    return locales.find((l) => l === locale) || locales[0];
  }

  return (
    <List.Item>
      <Link
        href={`${ROUTES.BLOG}/${slug}`}
        variant={Link.variant.SECONDARY}
        className="tw-font-bold"
        locale={getLocale()}
        isNextLink
      >
        {title}
      </Link>
      <p className="tw-text-sm tw-italic">
        <span>{t("page:updated_at")} </span>
        <strong>{getDifferenceBetweenDates(updatedAt, new Date())}</strong>
      </p>
      <Block className="tw-pb-1">
        {categories.map((category) => {
          return (
            <span
              key={category.id}
              className={classNames(
                "tw-inline-block tw-py-1 tw-px-2 tw-rounded-sm tw-font-semibold tw-text-xs",
                CATEGORIES_COLORS[category.id],
              )}
            >
              {category.value}
            </span>
          );
        })}
      </Block>
    </List.Item>
  );
}
