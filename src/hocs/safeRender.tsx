import React, { useState } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { useDidMount } from "~/hooks";
import { T_ReactElement, T_ReactFunctionComponent } from "~/types";

// TODO: Type return
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function safeRender<P>(Component: T_ReactFunctionComponent<P>) {
  const SafeRenderHOC = (props: P): T_ReactElement => {
    const [mounted, setMounted] = useState(false);

    useDidMount(() => setMounted(true));

    if (!mounted) return null;

    return <Component {...props} />;
  };

  SafeRenderHOC.displayName = `safeRender(${Component.displayName || Component.name})`;

  return hoistNonReactStatics(SafeRenderHOC, Component);
}

export default safeRender;
