import { useEffect } from "react";

function useOnWindowResize(callback: () => void): void {
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
