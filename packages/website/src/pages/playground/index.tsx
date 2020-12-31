import * as React from "react";
import NextLink from "next/link";

import { MainLayout, Page, UL, Link } from "~/components";
import Routes from "~/data/routes.json";
import { getSiteTexts } from "~/utils/i18n";

const SiteTexts = getSiteTexts({ page: Routes.PLAYGROUND, layout: true });

function PlaygroundPage(): any {
  return (
    <Page config={{ noRobots: true }}>
      <MainLayout
        breadcumb={[
          { text: SiteTexts.layout.current_locale.breadcumb.home, url: Routes.HOME },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
            url: Routes.PLAYGROUND,
          },
        ]}
        title={SiteTexts.page.current_locale.title}
      >
        <UL>
          <li>
            <Link is={NextLink} href={Routes.PLAYGROUND_PROJECTS["stupid"]}>
              <a>stupid</a>
            </Link>
          </li>
          <li>
            <Link is={NextLink} href={Routes.PLAYGROUND_PROJECTS["strings"]}>
              <a>strings</a>
            </Link>
          </li>
          <li>
            <Link is={NextLink} href={Routes.PLAYGROUND_PROJECTS["virtual-reality"]}>
              <a>virtual-reality</a>
            </Link>
          </li>
        </UL>
      </MainLayout>
    </Page>
  );
}

export default PlaygroundPage;
