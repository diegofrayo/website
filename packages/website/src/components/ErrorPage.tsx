import * as React from "react";

import { getSiteTexts } from "~/i18n";
import { Routes } from "~/utils/constants";

import MainLayout from "./MainLayout";
import Page from "./Page";

function ErrorPage({ statusCode }: Record<string, unknown>): any {
  const SiteTexts = getSiteTexts({ page: Routes[`ERROR_${statusCode}`] });

  return (
    <Page>
      <MainLayout
        breadcumb={[{ text: SiteTexts.page.breadcumb, url: Routes.HOME }]}
        title={SiteTexts.page.title}
      >
        <p>{SiteTexts.page.body}</p>
      </MainLayout>
    </Page>
  );
}

export default ErrorPage;
