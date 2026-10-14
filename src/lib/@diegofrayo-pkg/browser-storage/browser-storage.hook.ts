"use client";

import { useCallback, useRef, useState } from "react";

import { isFunction } from "@diegofrayo-pkg/validator";

import BrowserStorageManager from "./browser-storage.service";
import type { BrowserStorageState, BrowserStorageStateConfig } from "./browser-storage.types";

function useBrowserStorage<ValueType>(
	config: BrowserStorageStateConfig<ValueType>,
): UseBrowserStorageReturn<ValueType> {
	// --- STATES & REFS ---
	const [BS_State] = useState<BrowserStorageState<ValueType>>(() =>
		BrowserStorageManager.createItem(config),
	);
	const [state, setState] = useState<ValueType>(() => BS_State.get());
	const initialValue = useRef<ValueType>(config.value);

	// --- API ---
	const setEnhancedState: SetEnhancedState<ValueType> = useCallback(
		(newValue) => {
			BS_State.set(isFunction(newValue) ? newValue(state) : newValue);
			setState(newValue);
		},
		[BS_State, state],
	);

	const clearState = useCallback((): void => {
		BS_State.remove();
		setState(initialValue.current);
	}, [BS_State]);

	return [state, setEnhancedState, clearState];
}

export default useBrowserStorage;

// --- TYPES ---

type UseBrowserStorageReturn<ValueType> = [ValueType, SetEnhancedState<ValueType>, () => void];

type SetEnhancedState<ValueType> = (newValue: ValueType | SetState<ValueType>) => void;

type SetState<ValueType> = (newValue: ValueType) => ValueType;
