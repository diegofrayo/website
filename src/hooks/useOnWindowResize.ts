import { useEffect, useRef } from "react";

import { T_Function } from "~/types";

function useOnWindowResize(callback: T_Function): void {
  const savedHandler = useRef(callback);

  useEffect(function updateCallbackRef() {
    savedHandler.current = callback;
  });

  useEffect(function createResizeEventListener() {
    function handleWindowResize(): void {
      savedHandler.current();
    }

    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
}

export default useOnWindowResize;
