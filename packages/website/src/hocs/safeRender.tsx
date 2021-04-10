import React, { useState } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { useDidMount } from "~/hooks";
import { T_Object, T_ReactFCReturn } from "~/types";

function safeRender(Component: any): any {
  const SafeRenderHOC = (props: T_Object): T_ReactFCReturn => {
    const [mounted, setMounted] = useState(false);

    useDidMount(() => setMounted(true));

    if (!mounted) return null;

    return <Component {...props} />;
  };

  SafeRenderHOC.displayName = `safeRender(${Component.displayName || Component.name})`;

  return hoistNonReactStatics(SafeRenderHOC, Component);
}

export default safeRender;
