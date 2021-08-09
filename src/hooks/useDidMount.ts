import { useEffect } from "react";

import { T_ReactEffectCallback } from "~/types";

function useDidMount(callback: T_ReactEffectCallback): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, []);
}

export default useDidMount;
