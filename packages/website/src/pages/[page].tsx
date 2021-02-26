import * as React from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import { GetStaticProps, GetStaticPaths } from "next";

import { Page, MainLayout } from "~/components/layout";
import { MDXContent } from "~/components/shared";
import Routes from "~/data/routes.json";
import { TypeLocale, TypeSiteTexts, TypePagesRoutes } from "~/types";
import {
  generateSupportedLocales,
  getItemLocale,
  getSiteTexts,
} from "~/utils/internationalization";
import { MDXComponentsConfig, MDXScope } from "~/utils/mdx";
import {
  removeEmojiFromPageTitle,
  generateObjectKeyInLowerCase,
  generateObjectKeyInUpperCase,
} from "~/utils/strings";

type TypeSitePageProps = {
  content: any;
  page: TypePagesRoutes;
  SiteTexts: TypeSiteTexts;
};

function SitePage({ content, page, SiteTexts }: TypeSitePageProps): any {
  const mdxContent = hydrate(content, { components: MDXComponentsConfig });

  return (
    <Page
      config={{
        title: removeEmojiFromPageTitle(SiteTexts.page.current_locale.title),
        pathname: Routes[generateObjectKeyInUpperCase(page)],
        description: SiteTexts.page.current_locale.meta_description,
        noRobots: SiteTexts.page.current_locale.meta_no_robots,
      }}
    >
      <MainLayout
        locales={
          SiteTexts.page.config.meta_no_robots
            ? undefined
            : generateSupportedLocales(
                SiteTexts.page.config.locales,
                Routes[generateObjectKeyInUpperCase(page)],
              )
        }
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: Routes.HOME as TypePagesRoutes,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb[generateObjectKeyInLowerCase(page)],
          },
        ]}
        title={SiteTexts.page.current_locale.title}
      >
        <MDXContent content={mdxContent} />
      </MainLayout>
    </Page>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  return {
    paths: Routes.__DYNAMIC_PAGES.reduce((result, page: string) => {
      return (result as any[]).concat(
        locales?.map(locale => {
          return { params: { page }, locale };
        }),
      );
    }, []),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const SiteTexts: TypeSiteTexts = getSiteTexts({
    page: Routes[generateObjectKeyInUpperCase(params?.page as string)],
    layout: true,
    locale: locale as TypeLocale,
  });

  const file = fs.readFileSync(
    `${process.cwd()}/src/data/pages/${getItemLocale(
      SiteTexts.page.config.locales,
      SiteTexts.page.config.default_locale,
      locale as TypeLocale,
    )}/${params?.page}.mdx`,
    "utf8",
  );

  const content = await renderToString(file, {
    components: MDXComponentsConfig,
    scope: MDXScope,
  });

  return { props: { content, page: params?.page, SiteTexts } };
};

export default SitePage;
