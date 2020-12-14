import React, { useState } from "react";

import { useDidMount } from "~/hooks";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function safeRender(Component: any): any {
  return function safeRenderHOC(props: Record<string, any>): any {
    const [mounted, setMounted] = useState(false);

    useDidMount(() => setMounted(true));

    if (!mounted) return null;

    return <Component {...props} />;
  };
}

export default safeRender;
