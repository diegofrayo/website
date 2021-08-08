import React from "react";
import dynamic from "next/dynamic";
import { GetStaticPaths } from "next";

import { Page, MainLayout } from "~/components/layout";
import { getPageContentStaticProps, useTranslation } from "~/i18n";
import { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

type T_PageProps = {
  page: string;
};

const PLAYGROUND_PAGES = {
  books: {
    name: "",
    Component: dynamic(() => import(`../../components/pages/playground/[page]/Books`)),
  },
  "chords-creator": {
    name: "",
    Component: dynamic(() => import(`../../components/pages/playground/[page]/ChordsCreator`)),
  },
  "encrypt-lab": {
    name: "",
    Component: dynamic(() => import(`../../components/pages/playground/[page]/EncryptLab`)),
  },
  movies: {
    name: "",
    Component: dynamic(() => import(`../../components/pages/playground/[page]/Movies`)),
  },
  strings: {
    name: "",
    Component: dynamic(() => import(`../../components/pages/playground/[page]/Strings`)),
  },
  styles: {
    name: "",
    Component: dynamic(() => import(`../../components/pages/playground/[page]/Styles`)),
  },
  whatsapp: {
    name: "",
    Component: dynamic(() => import(`../../components/pages/playground/[page]/WhatsApp`)),
  },
};

function PlaygroundPage({ page }: T_PageProps): T_ReactElement {
  const { t } = useTranslation();

  const { Component } = PLAYGROUND_PAGES[page];

  return (
    <Page
      config={{
        title: t("seo:title") || t("page:title"),
        description: t("seo:description") || t("page:description"),
        pathname: `${ROUTES.PLAYGROUND}/${page}`,
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
            text: t("layout:breadcumb:playground"),
            url: ROUTES.PLAYGROUND,
          },
          {
            text: page,
          },
        ]}
        title={page}
        showGoToTopButton
      >
        <Component />
      </MainLayout>
    </Page>
  );
}

export default PlaygroundPage;

// --- Next.js functions ---

export const getStaticPaths: GetStaticPaths<{ page: string }> = async function getStaticPaths() {
  return {
    paths: Object.keys(PLAYGROUND_PAGES).map((page) => {
      return { params: { page } };
    }),
    fallback: false,
  };
};

export const getStaticProps = getPageContentStaticProps<T_PageProps, T_PageProps>({
  page: ROUTES.PLAYGROUND,
  callback: async ({ params }) => {
    return {
      props: {
        page: params.page,
      },
    };
  },
});
