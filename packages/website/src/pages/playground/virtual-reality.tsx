import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { UL, Link } from "~/components/primitive";
import Routes from "~/data/routes.json";
import { useAssets } from "~/hooks";
import { TypeSiteTexts, TypePagesRoutes } from "~/types";
import { getSiteTexts } from "~/utils/internationalization";

const SiteTexts: TypeSiteTexts = getSiteTexts({ layout: true });
const PAGE_NAME = "virtual-reality";

function VRPage(): any {
  const { VR_Assets } = useAssets();

  return (
    <Page config={{ title: PAGE_NAME, noRobots: true, assets: ["vr"] }}>
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
        <UL>
          <li>
            <Link href={VR_Assets.INDEX}>index.html</Link>
          </li>
          <li>
            <Link href={VR_Assets.SNIPPETS}>snippets.md</Link>
          </li>
        </UL>
      </MainLayout>
    </Page>
  );
}

export default VRPage;
