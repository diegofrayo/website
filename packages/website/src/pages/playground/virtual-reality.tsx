import React from "react";

import { MainLayout, Page, UL, Link } from "~/components";
import { Routes } from "~/utils/constants";
import { getSiteTexts } from "~/utils/i18n";

function StupidPage(): any {
  const SiteTexts = getSiteTexts({ layout: true });

  return (
    <Page metadata={{ title: "virtual-reality", noRobots: true }}>
      <MainLayout
        breadcumb={[
          { text: SiteTexts.layout.current_locale.breadcumb.home, url: Routes.HOME },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
            url: Routes.PLAYGROUND(),
          },
          {
            text: "virtual-reality",
            url: Routes.PLAYGROUND("virtual-reality"),
          },
        ]}
        title="virtual-reality"
      >
        <UL>
          <li>
            <Link href="/static/playground/virtual-reality/index.html">example.html</Link>
          </li>
          <li>
            <Link href="/static/playground/virtual-reality/snippets.md">snippets.md</Link>
          </li>
        </UL>
      </MainLayout>
    </Page>
  );
}

export default StupidPage;
