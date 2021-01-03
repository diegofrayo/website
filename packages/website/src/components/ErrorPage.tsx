import * as React from "react";

import Routes from "~/data/routes.json";
import { useInternationalization } from "~/hooks";

import MainLayout from "./MainLayout";
import Page from "./Page";

type TypeErrorPageProps = {
  statusCode: 404 | 500;
};

function ErrorPage({ statusCode }: TypeErrorPageProps): any {
  const { SiteTexts } = useInternationalization({ page: Routes[`ERROR_${statusCode}`] });

  return (
    <Page config={{ noRobots: true }}>
      <MainLayout
        breadcumb={[{ text: SiteTexts.page.current_locale.breadcumb, url: Routes.HOME }]}
        title={SiteTexts.page.current_locale.title}
      >
        <p>{SiteTexts.page.current_locale.body}</p>
      </MainLayout>
    </Page>
  );
}

export default ErrorPage;
