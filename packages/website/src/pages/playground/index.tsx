import * as React from "react";
import NextLink from "next/link";

import { MainLayout, Page, UL, Link } from "~/components";
import Routes from "~/data/routes.json";
import { withTranslations } from "~/hocs";
import { TypeSiteTexts } from "~/types";

type TypePlaygroundPageProps = {
  SiteTexts: TypeSiteTexts;
};

function PlaygroundPage({ SiteTexts }: TypePlaygroundPageProps): any {
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
          {Object.entries(Routes.PLAYGROUND_PROJECTS).map(([name, route]) => {
            return (
              <li key={`PlaygroundPage-${name}`}>
                <Link is={NextLink} href={route}>
                  {name}
                </Link>
              </li>
            );
          })}
        </UL>
      </MainLayout>
    </Page>
  );
}

export default withTranslations(PlaygroundPage, {
  page: Routes.PLAYGROUND,
  layout: true,
});
