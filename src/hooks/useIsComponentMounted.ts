import * as React from "react";

import useDidMount from "./useDidMount";

function useIsComponentMounted(): boolean {
	// --- STATES & REFS ---
	const isMountedRef = React.useRef(true);

	// --- EFFECTS ---
	useDidMount(() => {
		isMountedRef.current = true;

		return () => {
			isMountedRef.current = false;
		};
	});

	return isMountedRef.current;
}

export default useIsComponentMounted;
