import React from "react";

import { Page, MainLayout } from "~/components/layout";
import Lab from "~/components/pages/playground/lab";
import Routes from "~/data/routes.json";
import { TypeSiteTexts, TypePagesRoutes } from "~/types";
import { getSiteTexts } from "~/utils/internationalization";

const SiteTexts: TypeSiteTexts = getSiteTexts({ layout: true });
const PAGE_NAME = "lab";

function LabPage(): any {
  return (
    <Page config={{ title: PAGE_NAME, noRobots: true }}>
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: Routes.HOME as TypePagesRoutes,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
            url: Routes.PLAYGROUND as TypePagesRoutes,
          },
          {
            text: PAGE_NAME,
          },
        ]}
        title={PAGE_NAME}
      >
        <Lab />
      </MainLayout>
    </Page>
  );
}

export default LabPage;