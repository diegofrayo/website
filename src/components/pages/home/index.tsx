import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Text } from "~/components/primitive";
import { useTranslation } from "~/i18n";
import type { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

function Home(): T_ReactElement {
  const { t } = useTranslation();

  return (
    <Page
      config={{
        title: t("seo:title"),
        description: t("seo:description"),
        pathname: ROUTES.HOME,
        disableSEO: Boolean(t("page:config:is_seo_disabled")),
      }}
    >
      <MainLayout title="👋 I'm Diego Rayo">
        <Text className="tw-text-center">...</Text>
      </MainLayout>
    </Page>
  );
}

export default Home;
