import type DR from "@diegofrayo/types";

import useDidMount from "./useDidMount";

function useOnWindowStopScroll({
	onScrollStoppedCallback,
	onScrollCallback = (): void => undefined,
	timeout = 3000,
}: {
	onScrollStoppedCallback: () => void;
	onScrollCallback?: () => void;
	timeout?: number;
}): () => void {
	// --- VARS ---
	let isScrolling: DR.SetTimeout;
	let isMounted = false;

	// --- EFFECTS ---
	useDidMount(() => {
		isMounted = true;
		window.addEventListener("scroll", onScroll, false);
	});

	// --- UTILS ---
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
