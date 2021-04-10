import { useEffect, useRef } from "react";

function useOnWindowScroll(callback: (event: any) => void, when = true): void {
  const savedHandler = useRef(callback);

  useEffect(function updateCallbackRef() {
    savedHandler.current = callback;
  });

  useEffect(
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
