import * as React from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import { Page, MainLayout, MDXContent } from "~/components";
import { getSiteTexts } from "~/i18n";
import { Routes, PAGES_NAMES, DEFAULT_LOCALE } from "~/utils/constants";
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
    <Page metadata={{ title: removeEmojiFromTitle(SiteTexts.page.title) }}>
      <MainLayout
        breadcumb={[
          { text: SiteTexts.layout.breadcumb.home, url: Routes.HOME },
          {
            text: SiteTexts.layout.breadcumb[toLowerCaseObjectProperty(page)],
            url: Routes[toUpperCaseObjectProperty(page)],
          },
        ]}
        title={SiteTexts.page.title}
      >
        <MDXContent content={mdxContent} />
      </MainLayout>
    </Page>
  );
}

export async function getStaticPaths(): Promise<Record<string, any>> {
  return {
    paths: PAGES_NAMES.map(page => {
      return { params: { page } };
    }),
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: Record<string, any>): Promise<Record<string, any>> {
  const file = fs.readFileSync(
    `${process.cwd()}/src/data/pages/${DEFAULT_LOCALE}/${params.page}.mdx`,
    "utf8",
  );
  const content = await renderToString(file, {
    components: MDXComponentsConfig,
    scope: MDXScope,
  });

  return { props: { content, page: params.page } };
}

export default SitePage;
