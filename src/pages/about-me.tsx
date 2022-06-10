import * as React from "react";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import { Page, MainLayout } from "~/components/layout";
import { MDXContent } from "~/components/shared";
import { useTranslation, getPageContentStaticProps } from "~/i18n";
import { dataLoader } from "~/server";
import { MDXScope } from "~/utils/mdx";
import { ROUTES } from "~/utils/routing";
import type { T_ReactElement } from "~/types";

type T_AboutMePageProps = {
  pageMDXContent: MDXRemoteSerializeResult;
};

function AboutMePage({ pageMDXContent }: T_AboutMePageProps): T_ReactElement {
  // hooks
  const { t } = useTranslation();

  // render
  return (
    <Page
      config={{
        title: t("seo:title"),
        description: t("seo:description"),
        pathname: ROUTES.ABOUT_ME,
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

export default AboutMePage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps<T_AboutMePageProps, { page: string }>({
  page: ROUTES.ABOUT_ME,
  callback: async () => {
    const file = (await dataLoader({ path: "/pages/about-me/en.about-me.mdx" })) as string;
    const pageMDXContent = await serialize(file, {
      scope: {
        DATA: MDXScope.DATA,
      },
    });

    return {
      props: {
        pageMDXContent,
      },
    };
  },
});
