import React from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import { GetStaticProps, GetStaticPaths } from "next";

import { Page, MainLayout } from "~/components/layout";
import { MDXContent } from "~/components/pages/_shared";
import { T_Locale, T_SiteTexts, T_PagesRoutes, T_ReactChildrenProp } from "~/types";
import { getSnippetsFiles } from "~/components/pages/snippets/utils";
import { DYNAMIC_MAIN_PAGES, ROUTES } from "~/utils/routing";
import { getItemLocale, getSiteTexts } from "~/utils/internationalization";
import { MDXComponents, MDXScope } from "~/utils/mdx";
import { generateObjectKeyInLowerCase, generateObjectKeyInUpperCase } from "~/utils/strings";

type T_SitePageProps = {
  content: string;
  page: T_PagesRoutes;
  SiteTexts: T_SiteTexts;
};

function SitePage({ content, page, SiteTexts }: T_SitePageProps): T_ReactChildrenProp {
  const mdxContent = hydrate(content, { components: MDXComponents });

  return (
    <Page
      config={{
        title: SiteTexts.page.current_locale.title,
        pathname: ROUTES[generateObjectKeyInUpperCase(page)],
        description: SiteTexts.page.current_locale.meta_description,
        noRobots: SiteTexts.page.current_locale.meta_no_robots,
      }}
    >
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: ROUTES.HOME,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb[generateObjectKeyInLowerCase(page)],
          },
        ]}
        title={SiteTexts.page.current_locale.title}
        showGoToTopButton
      >
        <MDXContent
          variant={
            `/${page}` === ROUTES.SNIPPETS
              ? MDXContent.variant.DEFAULT
              : MDXContent.variant.UNSTYLED
          }
          content={mdxContent}
        />
      </MainLayout>
    </Page>
  );
}

type T_Path = { params: { page: string }; locale: T_Locale };

export const getStaticPaths: GetStaticPaths<{ page: string }> = async function getStaticPaths({
  locales = [],
}) {
  return {
    paths: DYNAMIC_MAIN_PAGES.reduce((result: T_Path[], page: string) => {
      return result.concat(
        locales.map((locale: T_Locale): T_Path => {
          return { params: { page }, locale };
        }),
      );
    }, []),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<T_SitePageProps, { page: string }> =
  async function getStaticProps({ params, locale }) {
    const page = params?.page || "";

    const SiteTexts = getSiteTexts({
      page: ROUTES[generateObjectKeyInUpperCase(page)],
      layout: true,
      locale: locale as T_Locale,
    });

    const file = fs.readFileSync(
      `${process.cwd()}/src/data/pages/${getItemLocale(
        SiteTexts.page.config.locales,
        SiteTexts.page.config.default_locale,
        locale as T_Locale,
      )}/${page}.mdx`,
      "utf8",
    );

    const content = await renderToString(file, {
      components: MDXComponents,
      scope: {
        DATA: {
          ...MDXScope.DATA,
          ...(`/${page}` === ROUTES.SNIPPETS && {
            snippets: getSnippetsFiles(),
          }),
          ...(`/${page}` === ROUTES.RESUME && {
            resume: SiteTexts.page.current_locale,
          }),
        },
      },
    });

    return {
      props: {
        content,
        SiteTexts,
        page: page as T_PagesRoutes,
      },
    };
  };

export default SitePage;
