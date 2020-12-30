import React from "react";

import { MainLayout, Page, UL, Link } from "~/components";
import { useAssets } from "~/hooks";
import { Routes } from "~/utils/constants";
import { getSiteTexts } from "~/utils/i18n";

function VRPage(): any {
  const { VR_Assets } = useAssets();

  const SiteTexts = getSiteTexts({ layout: true });
  const PAGE_NAME = "virtual-reality";

  return (
    <Page config={{ title: PAGE_NAME, noRobots: true, assets: ["vr"] }}>
      <MainLayout
        breadcumb={[
          { text: SiteTexts.layout.current_locale.breadcumb.home, url: Routes.HOME },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
            url: Routes.PLAYGROUND(),
          },
          {
            text: PAGE_NAME,
            url: Routes.PLAYGROUND(PAGE_NAME),
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
