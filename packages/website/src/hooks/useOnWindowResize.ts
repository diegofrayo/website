import { useEffect } from "react";

import { T_Function } from "~/types";

function useOnWindowResize(callback: T_Function): void {
  useEffect(
    function createResizeEventListener() {
      function handleWindowResize(): void {
        callback();
      }

      handleWindowResize();

      window.addEventListener("resize", handleWindowResize);

      return () => {
        window.removeEventListener("resize", handleWindowResize);
      };
    },
    [callback],
  );
}

export default useOnWindowResize;
