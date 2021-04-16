import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { T_ReactChildrenProp, T_ReactElement, T_SiteTexts } from "~/types";
import { getSiteTexts } from "~/utils/internationalization";
import { ROUTES } from "~/utils/routing";

const SiteTexts: T_SiteTexts = getSiteTexts({ layout: true });

function PlaygroundPageTemplate({
  children,
  pageName,
}: {
  children: T_ReactChildrenProp;
  pageName: string;
}): T_ReactElement {
  return (
    <Page config={{ title: pageName, noRobots: true, assets: ["vr"] }}>
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: ROUTES.HOME,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
            url: ROUTES.PLAYGROUND,
          },
          {
            text: pageName,
          },
        ]}
        title={pageName}
      >
        {children}
      </MainLayout>
    </Page>
  );
}

export default PlaygroundPageTemplate;
