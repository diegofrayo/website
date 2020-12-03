import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Routes } from "~/utils/constants";

function AboutMePage(): any {
  return (
    <Page>
      <MainLayout
        breadcumb={[
          { text: "Inicio", url: Routes.HOME },
          { text: "Acerca de mi", url: Routes.ABOUT_ME },
        ]}
        title="🙋‍♂️ Acerca de mi"
      >
        <p>En construcción... 🚧</p>
      </MainLayout>
    </Page>
  );
}

export default AboutMePage;
