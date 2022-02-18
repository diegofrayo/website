import * as React from "react";

import { useDidMount } from "~/hooks";
import type { T_Object, T_ReactFunctionComponent } from "~/types";
import { redirect, ROUTES } from "~/utils/routing";

import AuthService from "./service";

function withAuth(
  Component: T_ReactFunctionComponent,
  options?: { denyLoggedIn?: boolean; allowIf?: any },
) {
  return function WithAuthComponent(props: T_Object): any {
    const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(false);

    function redirect_(predicate) {
      if (predicate) {
        redirect(ROUTES.HOME);
        return;
      }

      setIsUserLoggedIn(true);
    }

    useDidMount(() => {
      if (options?.allowIf && options?.allowIf(props)) {
        redirect_(false);
      } else if (options?.denyLoggedIn) {
        redirect_(AuthService.isUserLoggedIn());
      } else {
        redirect_(!AuthService.isUserLoggedIn());
      }
    });

    if (isUserLoggedIn) {
      return <Component {...props} />;
    }

    return null;
  };
}

export default withAuth;
