import React from "react";
import dynamic from "next/dynamic";
import { GetStaticPaths } from "next";

import { Page, MainLayout } from "~/components/layout";
import { getPageContentStaticProps, useTranslation } from "~/i18n";
import { T_ReactElement } from "~/types";
import { PLAYGROUND_PAGES } from "~/utils/constants";
import { ROUTES } from "~/utils/routing";

const PLAYGROUND_PAGES_COMPONENTS = PLAYGROUND_PAGES.map((page) => {
  return {
    ...page,
    Component: dynamic(
      () => import(`../../components/pages/playground/[page]/${page.componentName}`),
    ),
  };
});

type T_PageProps = {
  page: string;
};

function PlaygroundPage(props: T_PageProps): T_ReactElement {
  const {
    // vars
    Component,
    title,
  } = useController(props);
  const { t } = useTranslation();

  return (
    <Page
      config={{
        title: title,
        disableSEO: true,
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
            text: title,
          },
        ]}
        title={title}
        showGoToTopButton
      >
        <Component />
      </MainLayout>
    </Page>
  );
}

export default PlaygroundPage;

// --- Next.js functions ---

export const getStaticPaths: GetStaticPaths<T_PageProps> = async function getStaticPaths() {
  return {
    paths: PLAYGROUND_PAGES.map((page) => {
      return { params: { page: page.slug } };
    }),
    fallback: false,
  };
};

export const getStaticProps = getPageContentStaticProps<T_PageProps, T_PageProps>({
  callback: async ({ params }) => {
    return {
      props: {
        page: params.page,
      },
    };
  },
});

// --- Controller ---

function useController({ page }: T_PageProps): {
  title: string;
  Component: any;
} {
  const pageConfig = PLAYGROUND_PAGES_COMPONENTS.find((item) => item.slug === page);
  if (!pageConfig) throw new Error(`"${page}" not found`);

  return {
    // vars
    Component: pageConfig.Component,
    title: pageConfig.title,
  };
}