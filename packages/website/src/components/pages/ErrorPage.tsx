import * as React from "react";

import { MainLayout, Page } from "~/components/layout";
import { Routes } from "~/utils/routing";
import { useInternationalization } from "~/hooks";

type T_ErrorPageProps = {
  statusCode: 404 | 500;
};

function ErrorPage({ statusCode }: T_ErrorPageProps): any {
  const { SiteTexts } = useInternationalization({ page: Routes[`ERROR_${statusCode}`] });

  return (
    <Page config={{ noRobots: true }}>
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.page.current_locale.breadcumb,
            url: Routes.HOME,
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
