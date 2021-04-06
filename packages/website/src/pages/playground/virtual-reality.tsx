import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { List, Link } from "~/components/primitive";
import { useAssets } from "~/hooks";
import { TypeSiteTexts } from "~/types";
import { getSiteTexts } from "~/utils/internationalization";
import { Routes } from "~/utils/routing";

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
            url: Routes.HOME,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
            url: Routes.PLAYGROUND,
          },
          {
            text: PAGE_NAME,
          },
        ]}
        title={PAGE_NAME}
      >
        <List>
          <Link href={VR_Assets.INDEX}>index.html</Link>
          <Link href={VR_Assets.SNIPPETS}>snippets.md</Link>
        </List>
      </MainLayout>
    </Page>
  );
}

export default VRPage;
