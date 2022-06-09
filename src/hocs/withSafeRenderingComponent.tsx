import * as React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { useDidMount } from "~/hooks";
import type { T_ReactElement, T_ReactFunctionComponent } from "~/types";

function withSafeRenderingComponent<P>(Component: T_ReactFunctionComponent<P>): any {
  function WithSafeRenderingComponent(props: P): T_ReactElement {
    const [mounted, setMounted] = React.useState(false);

    useDidMount(() => setMounted(true));

    if (!mounted) return null;

    return <Component {...props} />;
  }

  WithSafeRenderingComponent.displayName = `withSafeRenderingComponent(${
    Component.displayName || Component.name || "Component"
  })`;

  return hoistNonReactStatics(WithSafeRenderingComponent, Component);
}

export default withSafeRenderingComponent;
