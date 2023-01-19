import * as React from "react";

import { T_ReactEffectCallback } from "~/@diegofrayo/library/types/react";

function useDidMount(callback: T_ReactEffectCallback): void {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	React.useEffect(callback, []);
}

export default useDidMount;
