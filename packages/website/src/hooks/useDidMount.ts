import { useEffect } from "react";

import { T_EffectCallback } from "~/types";

function useDidMount(callback: T_EffectCallback): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, []);
}

export default useDidMount;
