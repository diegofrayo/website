import * as React from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import { Page, MainLayout, MDXContent } from "~/components";
import Routes from "~/data/routes.json";
import { TypeLocale, TypeSiteTexts, TypePagesRoutes } from "~/types";
import {
  generateSupportedLocales,
  getItemLocale,
  getSiteTexts,
} from "~/utils/internationalization";
import { MDXComponentsConfig, MDXScope } from "~/utils/mdx";
import {
  removeEmojiFromTitle,
  toLowerCaseObjectProperty,
  toUpperCaseObjectProperty,
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
        title: removeEmojiFromTitle(SiteTexts.page.current_locale.title),
        pathname: Routes[toUpperCaseObjectProperty(page)],
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
                Routes[toUpperCaseObjectProperty(page)],
              )
        }
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: Routes.HOME as TypePagesRoutes,
          },
          {
            text:
              SiteTexts.layout.current_locale.breadcumb[toLowerCaseObjectProperty(page)],
          },
        ]}
        title={SiteTexts.page.current_locale.title}
      >
        <MDXContent content={mdxContent} />
      </MainLayout>
    </Page>
  );
}

// TODO: Next types
export async function getStaticPaths({ locales }): Promise<Record<string, any>> {
  return {
    paths: Routes.__DYNAMIC_PAGES.reduce((result, page: string) => {
      return result.concat(
        locales.map((locale: TypeLocale) => {
          return { params: { page }, locale };
        }),
      );
    }, []),
    fallback: false,
  };
}

// TODO: Next types
export async function getStaticProps({
  params,
  locale,
}: Record<string, any>): Promise<Record<string, any>> {
  const SiteTexts: TypeSiteTexts = getSiteTexts({
    page: Routes[toUpperCaseObjectProperty(params.page)],
    layout: true,
    locale,
  });

  const file = fs.readFileSync(
    `${process.cwd()}/src/data/pages/${getItemLocale(
      SiteTexts.page.config.locales,
      SiteTexts.page.config.default_locale,
      locale,
    )}/${params.page}.mdx`,
    "utf8",
  );

  const content = await renderToString(file, {
    components: MDXComponentsConfig,
    scope: MDXScope,
  });

  return { props: { content, page: params.page, SiteTexts } };
}

export default SitePage;
