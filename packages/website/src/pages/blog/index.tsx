import * as React from "react";
import NextLink from "next/link";

import { Page, MainLayout, UL, Link, Render } from "~/components";
import Routes from "~/data/routes.json";
import { useInternationalization } from "~/hooks";
import { TypeBlogPost, TypeLocale, TypePagesRoutes } from "~/types";
import BlogService from "~/utils/blog";
import { getDifferenceBetweenDates } from "~/utils/dates";
import { generateSupportedLocales, getItemLocale } from "~/utils/internationalization";
import { removeEmojiFromPageTitle } from "~/utils/strings";
import { useQuery } from "react-query";

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
        <p className="tw-mb-4">{SiteTexts.page.current_locale.description}</p>
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
                      updatedAt={post.updated_at}
                      title={BlogService.composeTitle(post, locale)}
                      locale={locale}
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
  updatedAt: string;
};

function BlogEntry({ slug, title, locale, updatedAt }: TypeBlogEntryProps): any {
  const { SiteTexts } = useInternationalization({
    page: Routes.BLOG as TypePagesRoutes,
    layout: true,
  });

  return (
    <li>
      <Link is={NextLink} href={`${Routes.BLOG}/${slug}`} locale={locale}>
        {title}
      </Link>
      <p className="tw-text-sm tw-ml-4 tw-italic">
        <span>{SiteTexts.page.current_locale.updated_at} </span>
        <strong>{getDifferenceBetweenDates(updatedAt, new Date())}</strong>
      </p>
    </li>
  );
}
