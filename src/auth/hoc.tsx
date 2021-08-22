import React, { useState } from "react";

import { useDidMount } from "~/hooks";
import { T_Object, T_ReactFunctionComponent } from "~/types";
import { ROUTES } from "~/utils/routing";

import AuthService from "./service";

function withAuth(Component: T_ReactFunctionComponent, options?: { denyLoggedIn: boolean }) {
  return function WithAuthComponent(props: T_Object): any {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useDidMount(() => {
      if (options?.denyLoggedIn) {
        redirect(AuthService.isUserLoggedIn());
      } else {
        redirect(!AuthService.isUserLoggedIn());
      }
    });

    function redirect(predicate) {
      if (predicate) {
        window.location.href = ROUTES.HOME;
        return;
      }

      setIsUserLoggedIn(true);
    }

    if (isUserLoggedIn) {
      return <Component {...props} />;
    }

    return null;
  };
}

export default withAuth;
