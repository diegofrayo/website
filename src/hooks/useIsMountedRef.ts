import { useRef } from "react";

import useDidMount from "./useDidMount";

function useIsMountedRef(): { isComponentMounted: boolean } {
  const isMountedRef = useRef(true);

  useDidMount(function didMount() {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  });

  return { isComponentMounted: isMountedRef.current };
}

export default useIsMountedRef;
