import React from "react";

import { Page } from "~/components/layout";
import { Block } from "~/components/primitive";
import { Loader } from "~/components/pages/_shared";
import { useDidMount } from "~/hooks";
import { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

function SignOutPage(): T_ReactElement {
  useDidMount(() => {
    setTimeout(() => {
      window.localStorage.clear();
      window.location.href = ROUTES.HOME;
    }, 2000);
  });

  return (
    <Page
      config={{
        title: "Cerrando sesión...",
        disableSEO: true,
      }}
    >
      <Block className="tw-text-center tw-p-4">
        <Loader />
      </Block>
    </Page>
  );
}

export default SignOutPage;
