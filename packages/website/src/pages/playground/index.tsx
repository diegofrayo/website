import * as React from "react";
import NextLink from "next/link";

import { Page, MainLayout } from "~/components/layout";
import { Link, UL } from "~/components/primitive";
import Routes from "~/data/routes.json";
import { withTranslations } from "~/hocs";
import { TypePagesRoutes, TypeSiteTexts } from "~/types";

type TypePlaygroundPageProps = {
  SiteTexts: TypeSiteTexts;
};

function PlaygroundPage({ SiteTexts }: TypePlaygroundPageProps): any {
  return (
    <Page config={{ noRobots: true }}>
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: Routes.HOME as TypePagesRoutes,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
          },
        ]}
        title={SiteTexts.page.current_locale.title}
      >
        <UL>
          {["chords", "strings", "stupid", "virtual-reality", "styles"].sort().map(name => {
            return (
              <li key={`PlaygroundPage-${name}`}>
                <Link is={NextLink} href={`${Routes.PLAYGROUND}/${name}`} styled={false}>
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
  page: Routes.PLAYGROUND as TypePagesRoutes,
  layout: true,
});
