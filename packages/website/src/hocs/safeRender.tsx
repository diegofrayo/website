import React, { useState } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { useDidMount } from "~/hooks";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function safeRender(Component: any): any {
  const SafeRenderHOC = (props: Record<string, any>): any => {
    const [mounted, setMounted] = useState(false);

    useDidMount(() => setMounted(true));

    if (!mounted) return null;

    return <Component {...props} />;
  };

  SafeRenderHOC.displayName = `safeRender(${Component.displayName || Component.name})`;

  return hoistNonReactStatics(SafeRenderHOC, Component);
}

export default safeRender;
