import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { Dispatch } from "redux";

import type { T_Store } from "./types";
import initializeStore from "./store";

type T_UseQueryStateProps = (state: T_Store) => unknown;

export function useStoreSelector<G_Data>(selector: T_UseQueryStateProps): G_Data {
  return useSelector(selector) as G_Data;
}

export function useStore(initialState: Partial<T_Store>): T_Store {
  const store = useMemo(() => initializeStore(initialState), [initialState]);

  return store;
}

export function useStoreActionsDispatcher(): Dispatch {
  const dispath = useDispatch();

  return dispath;
}
