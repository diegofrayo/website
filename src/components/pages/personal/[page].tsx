import * as React from "react";
import dynamic from "next/dynamic";

import { Page, MainLayout } from "~/components/layout";
import { withAuth } from "~/auth";
import type { T_ReactElement } from "~/types";
import { PERSONAL_PAGES } from "~/utils/constants";

const PERSONAL_PAGES_COMPONENTS = PERSONAL_PAGES.map((page) => {
  return {
    ...page,
    Component: dynamic(() => import(`./components/${page.componentName}`)),
  };
});

function PersonalPage(props: T_PageProps): T_ReactElement {
  const {
    // vars
    Component,
    title,
  } = useController(props);

  return (
    <Page
      config={{
        title: title,
        disableSEO: true,
      }}
    >
      <MainLayout title={title}>
        <Component />
      </MainLayout>
    </Page>
  );
}

export default withAuth(PersonalPage, {
  allowIf: (props) => ["films", "whatsapp"].includes(props.page),
});

// --- Controller ---

function useController({ page }: T_PageProps): {
  title: string;
  Component: any;
} {
  const pageConfig = PERSONAL_PAGES_COMPONENTS.find((item) => item.slug === page);
  if (!pageConfig) throw new Error(`"${page}" not found`);

  return {
    // vars
    Component: pageConfig.Component,
    title: pageConfig.title,
  };
}

// --- Types ---

export type T_PageProps = {
  page: string;
};