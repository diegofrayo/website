/* eslint @typescript-eslint/dot-notation: 0 */

import * as React from "react";

import { logger } from "~/modules/logging";
import { delay } from "@diegofrayo/utils/misc";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T_Callback<G_Data> = (...args: any[]) => Promise<G_Data>;
type T_UseAsyncReturn<G_Data> = T_State<G_Data> & {
	mutation: T_Callback<G_Data>;
};

function useAsync<G_Data = unknown>(
	key: string,
	callback: T_Callback<G_Data>,
): T_UseAsyncReturn<G_Data> {
	// --- STATES & REFS ---
	const [state, dispatch] = React.useReducer(createReducer<G_Data>(), initialState);
	const savedHandler = React.useRef<typeof callback>(callback);

	// --- API ---
	const executeCallback: typeof callback = React.useCallback(async function executeCallback(
		...args
	) {
		try {
			logger("LOG", `Mutating "${key}"...`);

			dispatch({ type: "LOADING" });
			await delay(1000);

			const result = await savedHandler.current(...args);
			dispatch({ type: "SUCCESS", payload: result });

			return result;
		} catch (err) {
			dispatch({ type: "ERROR", payload: err });
			throw err;
		}
	}, []);

	return { ...state, mutation: executeCallback };
}

export default useAsync;

// --- REDUCERS ---

type T_State<G_Data> = {
	isLoading: boolean;
	data: G_Data | undefined;
	error: unknown | undefined;
};

type T_Action<G_Data> =
	| { type: "LOADING" }
	| { type: "SUCCESS"; payload: G_Data }
	| { type: "ERROR"; payload: unknown };

const initialState = {
	isLoading: false,
	data: undefined,
	error: undefined,
};

function createReducer<G_Data>() {
	return function reducer(state: T_State<G_Data>, action: T_Action<G_Data>): T_State<G_Data> {
		switch (action.type) {
			case "LOADING": {
				return { ...state, isLoading: true, data: undefined, error: undefined };
			}

			case "SUCCESS": {
				return { ...state, isLoading: false, data: action.payload, error: undefined };
			}

			case "ERROR": {
				return { ...state, isLoading: false, data: undefined, error: action.payload };
			}

			default: {
				throw Error(`Unknown action: ${action["type"]}`);
			}
		}
	};
}
