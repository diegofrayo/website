import React from "react";

import { MainLayout, Page } from "~/components/layout";
import { useTranslation } from "~/hooks";
import { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

function ErrorPage(): T_ReactElement {
  const { t } = useTranslation({ page: true, layout: true });

  return (
    <Page config={{ title: t("page:title"), disableSEO: true }}>
      <MainLayout
        breadcumb={[
          {
            text: t("layout:breadcumb:home"),
            url: ROUTES.HOME,
            isNextLink: false,
          },
        ]}
        title={t("page:title")}
      >
        <p>{t("page:body")}</p>
      </MainLayout>
    </Page>
  );
}

export default ErrorPage;
