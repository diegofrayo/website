import * as React from "react";
import classNames from "classnames";
import { useRouter } from "next/router";

import { Page, MainLayout } from "~/components/layout";
import { Link, Block, Text, InlineText } from "~/components/primitive";
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
              <Block className="tw-flex tw-flex-wrap tw-justify-between">
                {posts
                  .filter((post: T_BlogPost) => {
                    return post.isPublished;
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
                        createdAt={post.createdAt}
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
  "title" | "categories" | "slug" | "createdAt" | "locales" | "thumbnail"
>;

function BlogEntry({
  slug,
  title,
  categories,
  createdAt,
  locales,
  thumbnail,
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
              <InlineText>{t("page:created_at")} </InlineText>
              <InlineText is="strong">
                {getDifferenceBetweenDates(createdAt, new Date())}
              </InlineText>
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

      <style jsx>{`
        .root :global(header) {
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          height: 280px;

          @screen sm {
            height: 140px;
          }
        }
      `}</style>
    </article>
  );
}
