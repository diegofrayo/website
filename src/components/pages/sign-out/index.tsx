import * as React from "react";

import { Page } from "~/components/layout";
import { Block } from "~/components/primitive";
import { Loader } from "~/components/shared";
import { useDidMount } from "~/hooks";
import type { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

function SignOutPage(): T_ReactElement {
  useDidMount(() => {
    setTimeout(() => {
      window.localStorage.clear();
      window.location.href = `${ROUTES.HOME}?a=d`;
    }, 2000);
  });

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
