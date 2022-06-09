import * as React from "react";

import type { T_ReactRefObject } from "~/types";

function useClickOutside(ref: T_ReactRefObject<HTMLElement>, callback: () => void): void {
  React.useEffect(() => {
    const handleClickOutside: React.MouseEventHandler<HTMLElement> = function handleClickOutside(
      event,
    ): void {
      if (ref.current && !ref.current.contains(event.target)) {
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
