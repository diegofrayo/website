import { useCallback, useRef, useState } from "react";

function useBoolean(initialState: boolean) {
	// --- STATE & REFS ---
	const initialStateRef = useRef<typeof initialState>(initialState);
	const [state, setState] = useState<typeof initialState>(initialState);

	// --- ACTIONS ---
	const setTrue = useCallback(() => {
		setState(true);
	}, []);

	const setFalse = useCallback(() => {
		setState(false);
	}, []);

	const toggleState = useCallback(() => {
		setState((currentValue: boolean) => !currentValue);
	}, []);

	const reset = useCallback(() => {
		setState(initialStateRef.current);
	}, []);

	return { state: state, set: setState, setTrue, setFalse, toggleState, reset };
}

export default useBoolean;
