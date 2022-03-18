import * as React from "react";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { GetStaticPaths } from "next";

import { Page, MainLayout } from "~/components/layout";
import { MDXContent } from "~/components/shared";
import { useTranslation, getPageContentStaticProps, I18nService } from "~/i18n";
import { dataLoader } from "~/server";
import type { T_Locale, T_PageRoute, T_ReactElement } from "~/types";
import { MDXScope } from "~/utils/mdx";
import { DYNAMIC_MAIN_PAGES, ROUTES } from "~/utils/routing";
import { generateObjectKeyInUpperCase } from "~/utils/strings";

type T_SitePageProps = {
  page: string;
  pageMDXContent: MDXRemoteSerializeResult;
};

function SitePage({ page, pageMDXContent }: T_SitePageProps): T_ReactElement {
  const { t } = useTranslation();

  return (
    <Page
      config={{
        title: t("seo:title"),
        description: t("seo:description"),
        pathname: ROUTES[generateObjectKeyInUpperCase(page)],
        disableSEO: Boolean(t("page:config:is_seo_disabled")),
      }}
    >
      <MainLayout title={t("seo:title")}>
        <MDXContent
          variant={MDXContent.variant.UNSTYLED}
          content={pageMDXContent}
        />
      </MainLayout>
    </Page>
  );
}

export default SitePage;

// --- Next.js functions ---

type T_StaticPath = { params: { page: string }; locale: T_Locale };

export const getStaticPaths: GetStaticPaths<{ page: string }> = async function getStaticPaths({
  locales = [],
}) {
  return {
    paths: DYNAMIC_MAIN_PAGES.reduce((result: T_StaticPath[], page: string) => {
      return result.concat(
        locales.map((locale: T_Locale): T_StaticPath => {
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
    const file = (await dataLoader({
      path: `/pages/${page}/${I18nService.getContentLocale(
        pageContent.page?.config?.locales,
        locale as T_Locale,
        pageContent.page?.config?.default_locale,
      )}.${page}.mdx`,
    })) as string;
    const pageMDXContent = await serialize(file, {
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
