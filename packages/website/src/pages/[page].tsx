import React from "react";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import { GetStaticPaths } from "next";

import { Page, MainLayout } from "~/components/layout";
import { MDXContent } from "~/components/pages/_shared";
import { T_Locale, T_PageRoute, T_ReactElement } from "~/types";
import { useTranslation } from "~/hooks";
import { DYNAMIC_MAIN_PAGES, ROUTES } from "~/utils/routing";
import { getItemLocale } from "~/utils/internationalization";
import { MDXComponents, MDXScope } from "~/utils/mdx";
import { generateObjectKeyInLowerCase, generateObjectKeyInUpperCase } from "~/utils/strings";
import { getPageContentStaticProps } from "~/server/i18n";
import { loader } from "~/server/loader";

type T_SitePageProps = {
  page: string;
  pageMDXContent: string;
};

function SitePage({ page, pageMDXContent }: T_SitePageProps): T_ReactElement {
  const { t } = useTranslation({
    seo: true,
    page: true,
    layout: true,
  });

  const mdxContent = hydrate(pageMDXContent, { components: MDXComponents });

  return (
    <Page
      config={{
        title: t("seo:title"),
        description: t("seo:description"),
        pathname: ROUTES[generateObjectKeyInUpperCase(page)],
        disableSEO: Boolean(t("page:config:is_seo_disabled")),
      }}
    >
      <MainLayout
        breadcumb={[
          {
            text: t("layout:breadcumb:home"),
            url: ROUTES.HOME,
          },
          {
            text: t(`layout:breadcumb:${generateObjectKeyInLowerCase(page)}`),
          },
        ]}
        title={t("seo:title")}
        showGoToTopButton
      >
        <MDXContent variant={MDXContent.variant.UNSTYLED} content={mdxContent} />
      </MainLayout>
    </Page>
  );
}

export default SitePage;

// --- Next.js functions ---

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

export const getStaticProps = getPageContentStaticProps<T_SitePageProps, { page: string }>({
  page: ({ params }) => {
    if (!params.page) throw new Error('"page" param can\'t be undefined');

    return `/${params.page}` as T_PageRoute;
  },
  callback: async ({ params, locale, pageContent }) => {
    if (!params.page) throw new Error('"page" param can\'t be undefined');

    const page = params.page;
    const file = await loader({
      path: `/pages/${page}/${getItemLocale(
        pageContent.page?.config?.locales,
        pageContent.page?.config?.default_locale,
        locale as T_Locale,
      )}.${page}.mdx`,
    });
    const pageMDXContent: string = await renderToString(file, {
      components: MDXComponents,
      scope: {
        DATA: {
          ...MDXScope.DATA,
          ...(`/${page}` === ROUTES.RESUME && {
            resume: { timeline: pageContent.page?.timeline },
          }),
        },
      },
    });

    return {
      props: {
        page,
        pageMDXContent,
      },
    };
  },
});
