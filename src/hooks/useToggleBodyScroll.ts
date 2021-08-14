import { useEffect } from "react";

function useToggleBodyScroll(scrollDisabled: boolean): void {
  useEffect(
    function toggleBodyClasses() {
      if (scrollDisabled) {
        document.body.classList.add("scroll-disabled");
      } else {
        document.body.classList.remove("scroll-disabled");
      }
    },
    [scrollDisabled],
  );
}

export default useToggleBodyScroll;
