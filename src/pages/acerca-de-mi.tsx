import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Breadcumb } from "~/components/pages/_shared";
import { Separator } from "~/components/primitive";
import { Routes } from "~/utils/constants";

function AboutMe(): any {
  return (
    <Page>
      <MainLayout>
        <Breadcumb
          items={[
            { text: "Inicio", url: Routes.HOME },
            { text: "Acerca de mi", url: Routes.ABOUT_ME },
          ]}
        />
        <Separator size={4}></Separator>
        <h1 className="tw-text-left tw-text-3xl tw-text-gray-900 tw-font-bold">
          🤚 Acerca de mi
        </h1>
        <Separator size={3}></Separator>
        <p>En construcción... 🚧</p>
      </MainLayout>
    </Page>
  );
}

export default AboutMe;
