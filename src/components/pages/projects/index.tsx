import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Text } from "~/components/primitive";
import { withAuth } from "~/auth";
import type { T_ReactElement } from "~/types";

function ProjectsPage(): T_ReactElement {
  const PAGE_TITLE = "Projects";

  return (
    <Page
      config={{
        title: PAGE_TITLE,
        disableSEO: true,
      }}
    >
      <MainLayout title={PAGE_TITLE}>
        <Text className="tw-text-center">Work in progress...</Text>
      </MainLayout>
    </Page>
  );
}

export default withAuth(ProjectsPage);
