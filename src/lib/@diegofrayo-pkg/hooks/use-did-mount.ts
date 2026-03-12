import { useEffect } from "react";

import type DR from "../types";

function useDidMount(callback: DR.React.EffectCallback) {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(callback, []);
}

export default useDidMount;
