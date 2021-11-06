import React from "react";

import { T_Function } from "~/types";

function useOnWindowResize(callback: T_Function): void {
  const savedHandler = React.useRef(callback);

  React.useEffect(function updateCallbackRef() {
    savedHandler.current = callback;
  });

  React.useEffect(function createResizeEventListener() {
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
