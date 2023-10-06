import * as React from "react";

import type DR from "@diegofrayo/types";

function useDidMount(callback: DR.React.EffectCallback): void {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	React.useEffect(callback, []);
}

export default useDidMount;
