import * as React from "react";

import { MainLayout, Page } from "~/components/layout";
import Routes from "~/data/routes.json";
import { useInternationalization } from "~/hooks";
import { TypePagesRoutes } from "~/types";

type TypeErrorPageProps = {
  statusCode: 404 | 500;
};

function ErrorPage({ statusCode }: TypeErrorPageProps): any {
  const { SiteTexts } = useInternationalization({ page: Routes[`ERROR_${statusCode}`] });

  return (
    <Page config={{ noRobots: true }}>
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.page.current_locale.breadcumb,
            url: Routes.HOME as TypePagesRoutes,
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
