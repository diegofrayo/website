import * as React from "react";

import type { T_ReactRefObject } from "~/types";
import { isDOMNode } from "~/utils/browser";
import { exists, isNotTrue } from "~/utils/validations";

function useClickOutside(ref: T_ReactRefObject<HTMLElement>, callback: () => void): void {
  // effects
  React.useEffect(() => {
    const controller = new AbortController();

    document.addEventListener(
      "mousedown",
      function handleClickOutside(event: MouseEvent): void {
        if (
          isDOMNode(event.target) &&
          exists<HTMLElement>(ref.current) &&
          isNotTrue(ref.current.contains(event.target))
        ) {
          callback();
        }
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  }, [ref, callback]);
}

export default useClickOutside;
