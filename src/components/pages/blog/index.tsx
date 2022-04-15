import * as React from "react";
import classNames from "classnames";
import { useRouter } from "next/router";

import { Page, MainLayout } from "~/components/layout";
import { List, Link, Block, Text, InlineText } from "~/components/primitive";
import { Render } from "~/components/shared";
import { AuthService } from "~/auth";
import { useQuery } from "~/hooks";
import { useTranslation } from "~/i18n";
import BlogService from "~/services/blog";
import type { T_BlogPost, T_Locale, T_ReactElement } from "~/types";
import { getDifferenceBetweenDates } from "~/utils/dates";
import { isDevelopmentEnvironment } from "~/utils/misc";
import { ROUTES } from "~/utils/routing";

function Blog(): T_ReactElement {
  const { isLoading, error, data } = useQuery("blog", BlogService.fetchPosts);
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
        <Render
          isLoading={isLoading}
          error={error}
          data={data}
        >
          {(posts: T_BlogPost[]) => {
            return (
              <List variant={List.variant.DEFAULT}>
                {posts
                  .filter((post: T_BlogPost) => {
                    return isDevelopmentEnvironment() || AuthService.isUserLoggedIn()
                      ? true
                      : post.isPublished;
                  })
                  .map((post) => {
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

export default Blog;

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
        locale={getLocale()}
      >
        {title}
      </Link>
      <Text className="tw-text-sm tw-italic">
        <InlineText>{t("page:updated_at")} </InlineText>
        <InlineText is="strong">{getDifferenceBetweenDates(updatedAt, new Date())}</InlineText>
      </Text>
      <Block className="tw-pb-1">
        {categories.map((category) => {
          return (
            <InlineText
              key={category.id}
              className={classNames(
                "tw-inline-block tw-rounded-md tw-py-1 tw-px-2 tw-text-xs tw-font-semibold",
                CATEGORIES_COLORS[category.id],
              )}
            >
              {category.value}
            </InlineText>
          );
        })}
      </Block>
    </List.Item>
  );
}
