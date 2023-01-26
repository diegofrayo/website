import useDidMount from "./useDidMount";

import type { T_SetTimeout } from "~/@legacy/src/types";

function useOnWindowStopScroll({
	onScrollStoppedCallback,
	onScrollCallback = (): void => undefined,
	timeout = 3000,
}: {
	onScrollStoppedCallback: () => void;
	onScrollCallback?: () => void;
	timeout?: number;
}): () => void {
	let isScrolling: T_SetTimeout;
	let isMounted = false;

	// effects
	useDidMount(() => {
		isMounted = true;
		window.addEventListener("scroll", onScroll, false);
	});

	// utils
	function onScrollStopped(): void {
		if (!isMounted) return;

		onScrollStoppedCallback();
	}

	function onScroll(): void {
		window.clearTimeout(isScrolling);

		onScrollCallback();

		isScrolling = setTimeout(() => {
			onScrollStopped();
		}, timeout);
	}

	return () => {
		isMounted = false;
		window.removeEventListener("scroll", onScroll, false);
	};
}

export default useOnWindowStopScroll;
