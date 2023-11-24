import * as React from "react";

import type DR from "../types";

function useDidMount(callback: DR.React.EffectCallback) {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	React.useEffect(callback, []);
}

export default useDidMount;
