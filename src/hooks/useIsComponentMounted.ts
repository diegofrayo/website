import * as React from "react";

import useDidMount from "./useDidMount";

function useIsComponentMounted(): boolean {
	// states & refs
	const isMountedRef = React.useRef(true);

	// effects
	useDidMount(() => {
		isMountedRef.current = true;

		return () => {
			isMountedRef.current = false;
		};
	});

	return isMountedRef.current;
}

export default useIsComponentMounted;
