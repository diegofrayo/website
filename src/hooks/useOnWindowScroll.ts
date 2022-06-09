import * as React from "react";

import type { T_OnScrollEvent } from "~/types";

function useOnWindowScroll(callback: (event: T_OnScrollEvent) => void, when = true): void {
  const savedHandler = React.useRef(callback);

  React.useEffect(() => {
    savedHandler.current = callback;
  });

  React.useEffect(() => {
    if (!when) return;

    function passedCb(event) {
      savedHandler.current(event);
    }

    window.addEventListener("scroll", passedCb);

    return () => {
      window.removeEventListener("scroll", passedCb);
    };
  }, [when]);
}

export default useOnWindowScroll;
