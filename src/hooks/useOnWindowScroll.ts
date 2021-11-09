import * as React from "react";

import { T_OnScrollEvent } from "~/types";

function useOnWindowScroll(callback: (event: T_OnScrollEvent) => void, when = true): void {
  const savedHandler = React.useRef(callback);

  React.useEffect(function updateCallbackRef() {
    savedHandler.current = callback;
  });

  React.useEffect(
    function createScrollEventListener() {
      if (!when) return;

      function passedCb(event) {
        savedHandler.current(event);
      }

      window.addEventListener("scroll", passedCb);

      return () => {
        window.removeEventListener("scroll", passedCb);
      };
    },
    [when],
  );
}

export default useOnWindowScroll;
