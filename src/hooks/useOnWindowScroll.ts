import * as React from "react";

type T_Callback = (event: Event) => void;

function useOnWindowScroll(callback: T_Callback, when = true): void {
  // states & refs
  const savedHandler = React.useRef<T_Callback>(callback);

  // effects
  React.useEffect(() => {
    savedHandler.current = callback;
  });

  React.useEffect(() => {
    if (!when) {
      return () => undefined;
    }

    const passedCb: EventListener = (event: Event) => {
      savedHandler.current(event);
    };

    window.addEventListener("scroll", passedCb);

    return () => {
      window.removeEventListener("scroll", passedCb);
    };
  }, [when]);
}

export default useOnWindowScroll;
