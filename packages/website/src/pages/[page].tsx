import * as React from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import { Page, MainLayout, MDXContent } from "~/components";
import Routes from "~/data/routes.json";
import { CURRENT_LOCALE } from "~/utils/constants";
import { getSiteTexts } from "~/utils/i18n";
import { MDXComponentsConfig, MDXScope } from "~/utils/mdx";
import {
  toLowerCaseObjectProperty,
  toUpperCaseObjectProperty,
  removeEmojiFromTitle,
} from "~/utils/misc";

function SitePage({ content, page }: Record<string, any>): any {
  const mdxContent = hydrate(content, { components: MDXComponentsConfig });
  const SiteTexts = getSiteTexts({
    page: Routes[toUpperCaseObjectProperty(page)],
    layout: true,
  });

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

export async function getStaticPaths(): Promise<Record<string, any>> {
  return {
    paths: Routes.__DYNAMIC_PAGES.map(page => {
      return { params: { page } };
    }),
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: Record<string, any>): Promise<Record<string, any>> {
  const SiteTexts = getSiteTexts({
    page: Routes[toUpperCaseObjectProperty(params.page)],
  });

  const file = fs.readFileSync(
    `${process.cwd()}/src/data/pages/${
      SiteTexts.page.config.default_locale || CURRENT_LOCALE
    }/${params.page}.mdx`,
    "utf8",
  );
  const content = await renderToString(file, {
    components: MDXComponentsConfig,
    scope: MDXScope,
  });

  return { props: { content, page: params.page } };
}

export default SitePage;
