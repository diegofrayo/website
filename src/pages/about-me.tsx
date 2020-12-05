import * as React from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import { Page, MainLayout } from "~/components";
import { getSiteTexts } from "~/i18n";
import { Routes, DEFAULT_LOCALE } from "~/utils/constants";
import { MDXComponentsConfig, MDXScope } from "~/utils/mdx";

const SiteTexts = getSiteTexts({ page: Routes.ABOUT_ME, layout: true });

function AboutMePage({ content }: Record<string, any>): any {
  const mdxContent = hydrate(content, { components: MDXComponentsConfig });

  return (
    <Page>
      <MainLayout
        breadcumb={[
          { text: SiteTexts.layout.breadcumb.home, url: Routes.HOME },
          { text: SiteTexts.layout.breadcumb.about_me, url: Routes.ABOUT_ME },
        ]}
        title={SiteTexts.page.title}
      >
        <section>{mdxContent}</section>
      </MainLayout>
    </Page>
  );
}

export async function getStaticProps(): Promise<Record<string, any>> {
  const file = fs.readFileSync(
    `${process.cwd()}/src/data/pages/${DEFAULT_LOCALE}/about-me.mdx`,
    "utf8",
  );
  const content = await renderToString(file, {
    components: MDXComponentsConfig,
    scope: MDXScope,
  });

  return { props: { content }, revalidate: 1 };
}

export default AboutMePage;
