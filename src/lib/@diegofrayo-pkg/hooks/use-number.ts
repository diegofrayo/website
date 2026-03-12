import { useCallback, useRef, useState } from "react";

function useNumber(initialState: number) {
	// --- STATE & REFS ---
	const initialStateRef = useRef<typeof initialState>(initialState);
	const [state, setState] = useState<typeof initialState>(initialState);

	// --- ACTIONS ---
	const increment = useCallback(() => {
		setState((currentValue: number) => currentValue + 1);
	}, []);

	const decrement = useCallback(() => {
		setState((currentValue: number) => currentValue - 1);
	}, []);

	const reset = useCallback(() => {
		setState(initialStateRef.current);
	}, []);

	return { state: state, set: setState, increment, decrement, reset };
}

export default useNumber;
