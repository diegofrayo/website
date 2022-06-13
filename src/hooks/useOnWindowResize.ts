import * as React from "react";

type T_Callback = () => void;

function useOnWindowResize(callback: T_Callback): void {
  // states & refs
  const savedHandler = React.useRef<T_Callback>(callback);

  // effects
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
