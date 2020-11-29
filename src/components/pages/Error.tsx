import React from "react";

import { Page, MainLayout } from "~/components/layout";

function ErrorPage({ statusCode }: Record<string, unknown>): any {
  return (
    <Page>
      <MainLayout>
        <p>Error {statusCode}</p>
      </MainLayout>
    </Page>
  );
}

export default ErrorPage;
