import * as React from "react";

import useDidMount from "./useDidMount";

function useIsMountedRef(): { isComponentMounted: boolean } {
  // states & refs
  const isMountedRef = React.useRef(true);

  // effects
  useDidMount(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  });

  return { isComponentMounted: isMountedRef.current };
}

export default useIsMountedRef;
