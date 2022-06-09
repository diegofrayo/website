import * as React from "react";

function useOnWindowResize(callback: () => void): void {
  const savedHandler = React.useRef(callback);

  React.useEffect(() => {
    savedHandler.current = callback;
  });

  React.useEffect(() => {
    function handleWindowResize(): void {
      savedHandler.current();
    }

    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
}

export default useOnWindowResize;
