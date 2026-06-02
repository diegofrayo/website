"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { isFunction } from "@diegofrayo-pkg/validator";

import BrowserStorageManager from "./service";
import type { BrowserStorageState, BrowserStorageStateConfig } from "./types";

function useBrowserStorage<ValueType>(
	config: BrowserStorageStateConfig<ValueType>,
): UseBrowserStorageReturn<ValueType> {
	// --- STATES & REFS ---
	const BS_StateRef = useRef<BrowserStorageState<ValueType>>(
		BrowserStorageManager.createItem(config),
	);
	const [state, setState] = useState<ValueType>(() => BS_StateRef.current.get()); // eslint-disable-line react-hooks/refs -- TODO: [react] Fix me
	const initialValue = useRef<ValueType>(config.value);

	// --- EFFECTS ---
	useEffect(function onLoad() {
		setState(BS_StateRef.current.get());
	}, []);

	// --- API ---
	const setEnhancedState: SetEnhancedState<ValueType> = useCallback(
		(newValue) => {
			BS_StateRef.current.set(isFunction(newValue) ? newValue(state) : newValue);
			setState(newValue);
		},
		[state],
	);

	const clearState = useCallback((): void => {
		BS_StateRef.current.remove();
		setState(initialValue.current);
	}, []);

	return [state, setEnhancedState, clearState];
}

export default useBrowserStorage;

// --- TYPES ---

type UseBrowserStorageReturn<ValueType> = [ValueType, SetEnhancedState<ValueType>, () => void];

type SetEnhancedState<ValueType> = (newValue: ValueType | SetState<ValueType>) => void;

type SetState<ValueType> = (newValue: ValueType) => ValueType;
