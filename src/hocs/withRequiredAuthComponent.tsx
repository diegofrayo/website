import * as React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { AuthService } from "~/auth";
import { useDidMount } from "~/hooks";
import type { T_ReactElement, T_ReactFunctionComponent } from "~/types";

function withRequiredAuthComponent<P>(WrappedComponent: T_ReactFunctionComponent<P>): any {
  const WithRequiredAuthComponent = (props: P): T_ReactElement => {
    const [renderComponent, setRenderComponent] = React.useState(false);

    useDidMount(() => setRenderComponent(AuthService.isUserLoggedIn()));

    if (!renderComponent) return null;

    return <WrappedComponent {...props} />;
  };

  WithRequiredAuthComponent.displayName = `withRequiredAuthComponent(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return hoistNonReactStatics(WithRequiredAuthComponent, WrappedComponent);
}

export default withRequiredAuthComponent;
