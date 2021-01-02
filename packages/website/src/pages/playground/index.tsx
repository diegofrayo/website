import * as React from "react";
import NextLink from "next/link";

import { MainLayout, Page, UL, Link } from "~/components";
import Routes from "~/data/routes.json";
import { withTranslations } from "~/hocs";

function PlaygroundPage({ SiteTexts }): any {
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
              stupid
            </Link>
          </li>
          <li>
            <Link is={NextLink} href={Routes.PLAYGROUND_PROJECTS["strings"]}>
              strings
            </Link>
          </li>
          <li>
            <Link is={NextLink} href={Routes.PLAYGROUND_PROJECTS["virtual-reality"]}>
              virtual-reality
            </Link>
          </li>
        </UL>
      </MainLayout>
    </Page>
  );
}

export default withTranslations(PlaygroundPage, {
  page: Routes.PLAYGROUND,
  layout: true,
});
