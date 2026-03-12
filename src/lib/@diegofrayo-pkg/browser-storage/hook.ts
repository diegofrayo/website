import { useEffect, useRef, useState } from "react";

import BrowserStorageManager from "./service";
import type { BrowserStorageState, BrowserStorageStateConfig } from "./types";

function useBrowserStorage<ValueType>(
	config: BrowserStorageStateConfig<ValueType>,
): [ValueType, (newValue: ValueType) => void] {
	// --- STATES & REFS ---
	const BS_StateRef = useRef<BrowserStorageState<ValueType>>(
		BrowserStorageManager.createItem(config),
	);
	const [state, setState] = useState<ValueType>(BS_StateRef.current.get()); // eslint-disable-line react-hooks/refs -- TODO: [react] Fix me

	// --- EFFECTS ---
	useEffect(function onLoad() {
		setState(BS_StateRef.current.get());
	}, []);

	// --- API ---
	function setEnhancedState(newValue: ValueType) {
		BS_StateRef.current.set(newValue);
		setState(newValue);
	}

	return [state, setEnhancedState];
}

export default useBrowserStorage;
