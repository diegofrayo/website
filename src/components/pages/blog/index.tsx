import * as React from "react";
import classNames from "classnames";
import { useRouter } from "next/router";

import { Page, MainLayout } from "~/components/layout";
import { Link, Block, Text, InlineText } from "~/components/primitive";
import { Render } from "~/components/shared";
import { AuthService } from "~/auth";
import { useQuery } from "~/hooks";
import { T_Locale, useTranslation } from "~/i18n";
import { getDifferenceBetweenDates } from "~/utils/dates";
import { ROUTES } from "~/utils/routing";
import { isDevelopmentEnvironment } from "~/utils/app";
import type { T_ReactElement } from "~/types";

import BlogService, { T_BlogPost } from "./service";

function Blog(): T_ReactElement {
  // hooks
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
          {(response: unknown): T_ReactElement => {
            const posts = response as T_BlogPost[];

            return (
              <Block className="tw-flex tw-flex-wrap tw-justify-between">
                {posts
                  .filter((post: T_BlogPost) => {
                    return (
                      isDevelopmentEnvironment() || AuthService.isUserLoggedIn() || post.isPublished
                    );
                  })
                  .map((post) => {
                    return (
                      <BlogEntry
                        key={post.slug}
                        slug={post.slug}
                        title={post.title}
                        categories={post.categories}
                        publishedAt={post.publishedAt}
                        isPublished={post.isPublished}
                        locales={post.locales}
                        thumbnail={post.thumbnail}
                      />
                    );
                  })}
              </Block>
            );
          }}
        </Render>
      </MainLayout>
    </Page>
  );
}

export default Blog;

// --- Components ---

type T_BlogEntryProps = Pick<
  T_BlogPost,
  "title" | "categories" | "slug" | "publishedAt" | "locales" | "thumbnail" | "isPublished"
>;

function BlogEntry({
  slug,
  title,
  categories,
  publishedAt,
  locales,
  thumbnail,
  isPublished,
}: T_BlogEntryProps): T_ReactElement {
  // hooks
  const { t } = useTranslation();
  const { locale } = useRouter();

  // vars
  const CATEGORIES_COLORS = {
    tech: "tw-bg-green-200 dark:tw-bg-green-400 tw-text-black tw-opacity-75",
    personal: "tw-bg-blue-200 dark:tw-bg-blue-400 tw-text-black tw-opacity-75",
  };

  // utils
  function getLocale(): T_Locale {
    return locales.find((l) => l === locale) || locales[0];
  }

  // render
  return (
    <article className="root tw-my-8 tw-w-full dfr-shadow sm:tw-w-5/12">
      <Link
        href={`${ROUTES.BLOG}/${slug}`}
        variant={Link.variant.SECONDARY}
        locale={getLocale()}
        className="tw-flex tw-h-full tw-w-full tw-flex-col"
      >
        <Block
          is="header"
          style={{ backgroundImage: `url('${thumbnail}')` }}
        />
        <Block
          is="footer"
          className="tw-relative tw-flex-1 tw-pt-2 tw-pb-8"
        >
          <Text className="tw-mb-4 tw-px-2">{title}</Text>
          <Block className="tw-absolute tw-bottom-0 tw-flex tw-w-full tw-items-end tw-justify-between tw-px-2 tw-py-2">
            <Text className="tw-text-xs tw-font-normal tw-italic dfr-text-color-secondary">
              {isPublished ? (
                <React.Fragment>
                  <InlineText>{t("page:published_at")} </InlineText>
                  <InlineText is="strong">
                    {getDifferenceBetweenDates(publishedAt, new Date())}
                  </InlineText>
                </React.Fragment>
              ) : (
                "Draft 📝"
              )}
            </Text>
            <Block>
              {categories.map((category) => {
                return (
                  <InlineText
                    key={category.id}
                    className={classNames(
                      "tw-inline-block tw-py-1 tw-px-2 tw-text-xs tw-font-semibold",
                      CATEGORIES_COLORS[category.id],
                    )}
                  >
                    {category.value}
                  </InlineText>
                );
              })}
            </Block>
          </Block>
        </Block>
      </Link>

      <style jsx>
        {`
          .root :global(header) {
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            height: 280px;

            @screen sm {
              height: 140px;
            }
          }
        `}
      </style>
    </article>
  );
}
