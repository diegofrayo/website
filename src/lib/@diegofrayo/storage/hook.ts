// eslint-disable-next-line import/no-extraneous-dependencies
import * as React from "react";

import LocalStorageManager, {
	type T_LocalStorageState,
	type T_LocalStorageStateConfig,
} from "./service";

function useLocalStorageState<G_ValueType>(
	config: T_LocalStorageStateConfig<G_ValueType>,
): [G_ValueType, (newValue: G_ValueType) => void] {
	// --- STATES & REFS ---
	const { current: LS_StateRef } = React.useRef<T_LocalStorageState<G_ValueType>>(
		LocalStorageManager.createItem(config),
	);
	const [state, setState] = React.useState<G_ValueType>(LS_StateRef.get());

	// --- API ---
	function setEnhancedState(newValue: G_ValueType) {
		const newState = { ...LS_StateRef.get(), ...newValue };

		LS_StateRef.set(newState);
		setState(newState);
	}

	return [state, setEnhancedState];
}

export default useLocalStorageState;
