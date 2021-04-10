import { useEffect } from "react";

function useOnWindowResize(callback: () => void): any {
  useEffect(function createResizeEventListener() {
    function handleWindowResize() {
      callback();
    }

    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
}

export default useOnWindowResize;
