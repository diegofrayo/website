import { useLayoutEffect, useState } from "react";

function useWindowSize() {
	// --- STATE & REFS ---
	const [size, setSize] = useState([0, 0]);

	// --- EFFECTS ---
	useLayoutEffect(() => {
		const updateSize = () => setSize([window.innerWidth, window.innerHeight]);

		updateSize();

		window.addEventListener("resize", updateSize);

		return () => window.removeEventListener("resize", updateSize);
	}, []);

	return size;
}

export default useWindowSize;
