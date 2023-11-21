// eslint-disable-next-line import/no-extraneous-dependencies
import * as React from "react";

import BrowserStorageManager, {
	type T_BrowserStorageState,
	type T_BrowserStorageStateConfig,
} from "./service";

function useBrowserStorageState<G_ValueType>(
	config: T_BrowserStorageStateConfig<G_ValueType>,
): [G_ValueType, (newValue: G_ValueType) => void] {
	// --- STATES & REFS ---
	const { current: BS_StateRef } = React.useRef<T_BrowserStorageState<G_ValueType>>(
		BrowserStorageManager.createItem(config),
	);
	const [state, setState] = React.useState<G_ValueType>(BS_StateRef.get());

	// --- EFFECTS ---
	React.useEffect(
		function onLoad() {
			setState(BS_StateRef.get());
		},
		[BS_StateRef],
	);

	// --- API ---
	function setEnhancedState(newValue: G_ValueType) {
		BS_StateRef.set(newValue);
		setState(newValue);
	}

	return [state, setEnhancedState];
}

export default useBrowserStorageState;
