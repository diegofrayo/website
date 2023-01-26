// @ts-nocheck

import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import type { T_Store } from "~/@legacy/src/types";

import initializeStore from "./store";

type T_UseQueryStateProps = (state: T_Store) => unknown;

export function useStoreSelector<G_Data>(selector: T_UseQueryStateProps): G_Data {
	return useSelector(selector) as G_Data;
}

export function useStore(initialState: Partial<T_Store>): any {
	const store = useMemo(() => initializeStore(initialState), [initialState]);

	return store;
}

export function useStoreActionsDispatcher(): any {
	const dispath = useDispatch();

	return dispath;
}
