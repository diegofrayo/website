import React from "react";

import { MainLayout, Page } from "~/components/layout";
import { useTranslation } from "~/i18n";
import { T_ReactElement } from "~/types";

function ErrorPage(): T_ReactElement {
  const { t } = useTranslation();

  return (
    <Page
      config={{
        title: t("page:title"),
        disableSEO: true,
      }}
    >
      <MainLayout title={t("page:title")}>
        <p className="tw-text-center">{t("page:body")}</p>
      </MainLayout>
    </Page>
  );
}

export default ErrorPage;
