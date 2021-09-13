import React, { useState } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { useDidMount } from "~/hooks";
import { T_ReactElement, T_ReactFunctionComponent } from "~/types";

function safeRender<P>(Component: T_ReactFunctionComponent<P>): any {
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
