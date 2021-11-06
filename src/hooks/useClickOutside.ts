import React from "react";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function useClickOutside(ref, callback): any {
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

export default useClickOutside;
