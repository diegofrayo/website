import * as React from "react";

import { Page } from "~/components/layout";
import { Block } from "~/components/primitive";
import { Loader } from "~/components/shared";
import { useDidMount } from "~/hooks";
import { redirect, ROUTES } from "~/utils/routing";
import type { T_ReactElement } from "~/types";

function SignOutPage(): T_ReactElement {
  // effects
  useDidMount(() => {
    setTimeout(() => {
      window.localStorage.clear();
      redirect(`${ROUTES.HOME}?a=d`);
    }, 2000);
  });

  // render
  return (
    <Page
      config={{
        title: "Cerrando sesión...",
        disableSEO: true,
      }}
    >
      <Block className="tw-p-4 tw-text-center">
        <Loader />
      </Block>
    </Page>
  );
}

export default SignOutPage;
