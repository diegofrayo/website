import React from "react";

import { MainLayout, Page } from "~/components/layout";
import { useInternationalization } from "~/hooks";
import { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

type T_ErrorPageProps = {
  statusCode: 404 | 500;
};

function ErrorPage({ statusCode }: T_ErrorPageProps): T_ReactElement {
  const { SiteTexts } = useInternationalization({ page: ROUTES[`ERROR_${statusCode}`] });

  return (
    <Page config={{ noRobots: true }}>
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.page.current_locale.breadcumb,
            url: ROUTES.HOME,
            isNextLink: false,
          },
        ]}
        title={SiteTexts.page.current_locale.title}
      >
        <p>{SiteTexts.page.current_locale.body}</p>
      </MainLayout>
    </Page>
  );
}

export default ErrorPage;
