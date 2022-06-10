import * as React from "react";

import { useDidMount } from "~/hooks";
import type { T_ReactElementNullable, T_ReactFunctionComponent, T_UnknownObject } from "~/types";
import { redirect as globalRedirect, ROUTES } from "~/utils/routing";

import AuthService from "./service";

function withAuth(
  Component: T_ReactFunctionComponent,
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: { denyLoggedIn?: boolean; allowIf?: (props: T_UnknownObject) => boolean },
): T_ReactFunctionComponent {
  return function WithAuthComponent(props: T_UnknownObject): T_ReactElementNullable {
    // states & refs
    const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(false);

    // effects
    useDidMount(() => {
      if (options?.allowIf && options?.allowIf(props)) {
        redirect(false);
      } else if (options?.denyLoggedIn) {
        redirect(AuthService.isUserLoggedIn());
      } else {
        redirect(AuthService.isUserLoggedIn() === false);
      }
    });

    // utils
    function redirect(predicate: boolean): void {
      if (predicate) {
        globalRedirect(ROUTES.HOME);
        return;
      }

      setIsUserLoggedIn(true);
    }

    // render
    if (isUserLoggedIn) {
      return <Component {...props} />;
    }

    return null;
  };
}

export default withAuth;
