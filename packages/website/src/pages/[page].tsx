import * as React from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import { Page, MainLayout, MDXContent } from "~/components";
import Routes from "~/data/routes.json";
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

function SitePage({ content, page, SiteTexts }: Record<string, any>): any {
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
          { text: SiteTexts.layout.current_locale.breadcumb.home, url: Routes.HOME },
          {
            text:
              SiteTexts.layout.current_locale.breadcumb[toLowerCaseObjectProperty(page)],
            url: Routes[toUpperCaseObjectProperty(page)],
          },
        ]}
        title={SiteTexts.page.current_locale.title}
      >
        <MDXContent content={mdxContent} />
      </MainLayout>
    </Page>
  );
}

export async function getStaticPaths({ locales }): Promise<Record<string, any>> {
  return {
    paths: Routes.__DYNAMIC_PAGES.reduce((result, page) => {
      return result.concat(
        locales.map(locale => {
          return { params: { page }, locale };
        }),
      );
    }, []),
    fallback: false,
  };
}

export async function getStaticProps({
  params,
  locale,
}: Record<string, any>): Promise<Record<string, any>> {
  const SiteTexts = getSiteTexts({
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
