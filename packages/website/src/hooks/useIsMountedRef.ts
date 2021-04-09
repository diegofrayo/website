import { useEffect, useRef } from "react";

function useIsMountedRef() {
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  });

  return { isComponentMounted: isMountedRef.current };
}

export default useIsMountedRef;
