import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, List } from "~/components/primitive";
import { Routes } from "~/utils/routing";
import { withTranslations } from "~/hocs";
import { T_SiteTexts } from "~/types";
import { isUserLoggedIn } from "~/utils/misc";

type T_PlaygroundPageProps = {
  SiteTexts: T_SiteTexts;
};

function PlaygroundPage({ SiteTexts }: T_PlaygroundPageProps): any {
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
          {["chords", "strings", "stupid", "virtual-reality", "styles", "wp"]
            .sort()
            .concat(isUserLoggedIn() ? ["lab"] : [])
            .map(name => {
              return (
                <List.Item key={`PlaygroundPage-${name}`}>
                  <Link
                    href={`${Routes.PLAYGROUND}/${name}`}
                    variant={Link.variant.UNSTYLED}
                    isNextLink
                  >
                    {name}
                  </Link>
                </List.Item>
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
