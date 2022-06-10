import * as React from "react";

import type { T_ReactRefObject } from "~/types";
import { isDOMNode } from "~/utils/browser";
import { exists, isNotTrue } from "~/utils/validations";

function useClickOutside(ref: T_ReactRefObject<HTMLElement>, callback: () => void): void {
  // effects
  React.useEffect(() => {
    const handleClickOutside: EventListener = function handleClickOutside(event: Event): void {
      if (
        isDOMNode(event.target) &&
        exists<HTMLElement>(ref.current) &&
        isNotTrue(ref.current.contains(event.target))
      ) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

export default useClickOutside;
