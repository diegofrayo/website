import React, { Fragment } from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, List, Space } from "~/components/primitive";
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
        <PagesList pages={["chords", "strings", "virtual-reality", "styles", "wp"]} />
        {isUserLoggedIn() && (
          <Fragment>
            <Space className="tw-mt-6 tw-mb-4" variant={Space.variant.DASHED} />
            <PagesList pages={["stupid", "maria", "baria", "movies"]} />
          </Fragment>
        )}
      </MainLayout>
    </Page>
  );
}

export default withTranslations(PlaygroundPage, {
  page: ROUTES.PLAYGROUND,
  layout: true,
});

// --- Components ---

function PagesList({ pages }) {
  return (
    <List>
      {pages.sort().map((name) => {
        return (
          <List.Item key={`PlaygroundPage-name-${name}`}>
            <Link href={`${ROUTES.PLAYGROUND}/${name}`} variant={Link.variant.UNSTYLED} isNextLink>
              {name}
            </Link>
          </List.Item>
        );
      })}
    </List>
  );
}
