// TODO: Fix eslint warnings
import { useLayoutEffect, useRef } from "react";

import type UtilsTypes from "../types";

type UseOnScrollProps = {
	onScrollCallback: () => void;
	onScrollStopCallback: () => void;
	timeout?: number;
};

function useOnScroll({ onScrollCallback, onScrollStopCallback, timeout = 3000 }: UseOnScrollProps) {
	// --- STATES & REFS ---
	const isMounted = useRef(false);
	const isScrolling = useRef<UtilsTypes.SetTimeout | undefined>(undefined);

	// --- EFFECTS ---
	useLayoutEffect(() => {
		const onScrollStop = () => {
			if (!isMounted.current) return;

			onScrollStopCallback();
		};

		const onScroll = () => {
			window.clearTimeout(isScrolling.current);

			onScrollCallback();

			isScrolling.current = setTimeout(() => {
				onScrollStop();
			}, timeout);
		};

		isMounted.current = true;
		window.addEventListener("scroll", onScroll, false);

		return () => {
			isMounted.current = false;
			window.removeEventListener("scroll", onScroll, false);
		};
	}, []);
}

export default useOnScroll;
