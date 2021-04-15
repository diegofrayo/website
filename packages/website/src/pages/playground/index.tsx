import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, List } from "~/components/primitive";
import { withTranslations } from "~/hocs";
import { T_ReactElement, T_SiteTexts } from "~/types";
import { isUserLoggedIn } from "~/utils/misc";
import { ROUTES } from "~/utils/routing";

type T_PlaygroundPageProps = {
  SiteTexts: T_SiteTexts;
};

function PlaygroundPage({ SiteTexts }: T_PlaygroundPageProps): T_ReactElement {
  return (
    <Page config={{ noRobots: true }}>
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: ROUTES.HOME,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
          },
        ]}
        title={SiteTexts.page.current_locale.title}
      >
        <List>
          {["chords", "strings", "virtual-reality", "styles", "wp"]
            .sort()
            .concat(isUserLoggedIn() ? ["stupid", "maria", "baria"] : [])
            .map((name) => {
              return (
                <List.Item key={`PlaygroundPage-name-${name}`}>
                  <Link
                    href={`${ROUTES.PLAYGROUND}/${name}`}
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
  page: ROUTES.PLAYGROUND,
  layout: true,
});
