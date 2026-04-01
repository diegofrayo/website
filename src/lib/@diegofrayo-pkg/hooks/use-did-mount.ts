import { useEffect } from "react";

import type ReactTypes from "../types/react";

function useDidMount(callback: ReactTypes.EffectCallback) {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(callback, []);
}

export default useDidMount;
