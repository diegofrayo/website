import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, List } from "~/components/primitive";
import { Routes } from "~/utils/routing";
import { withTranslations } from "~/hocs";
import { TypePagesRoutes, TypeSiteTexts } from "~/types";
import { isUserLoggedIn } from "~/utils/misc";

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
            url: Routes.HOME,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
          },
        ]}
        title={SiteTexts.page.current_locale.title}
      >
        <List>
          {["chords", "strings", "stupid", "virtual-reality", "styles"]
            .sort()
            .concat(isUserLoggedIn() ? ["lab"] : [])
            .map(name => {
              return (
                <Link
                  key={`PlaygroundPage-${name}`}
                  isNextLink
                  href={`${Routes.PLAYGROUND}/${name}`}
                  className="tw-text-black dark:tw-text-white"
                  variant={Link.variant.UNSTYLED}
                >
                  {name}
                </Link>
              );
            })}
        </List>
      </MainLayout>
    </Page>
  );
}

export default withTranslations(PlaygroundPage, {
  page: Routes.PLAYGROUND,
  layout: true,
});
