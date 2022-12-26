import * as React from "react";

import type { T_ReactEffectCallback } from "~/types";

function useDidMount(callback: T_ReactEffectCallback): void {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	React.useEffect(callback, []);
}

export default useDidMount;
