import React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { AuthService } from "~/auth";
import { useDidMount } from "~/hooks";
import { T_ReactElement, T_ReactFunctionComponent } from "~/types";

function protectedComponent<P>(Component: T_ReactFunctionComponent<P>): any {
  const ProtectedComponentHOC = (props: P): T_ReactElement => {
    const [renderComponent, setRenderComponent] = React.useState(false);

    useDidMount(() => setRenderComponent(AuthService.isUserLoggedIn()));

    if (!renderComponent) return null;

    return <Component {...props} />;
  };

  ProtectedComponentHOC.displayName = `protectedComponent(${
    Component.displayName || Component.name
  })`;

  return hoistNonReactStatics(ProtectedComponentHOC, Component);
}

export default protectedComponent;
