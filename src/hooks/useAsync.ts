/* eslint @typescript-eslint/dot-notation: 0 */

import * as React from "react";

import { logger } from "~/modules/logging";
import v from "@diegofrayo/v";
import { delay } from "@diegofrayo/utils/misc";

type T_Callback<G_CallbackArgs extends unknown[], G_CallbackReturn> = (
	...args: G_CallbackArgs
) => Promise<G_CallbackReturn>;

type T_Opts = { withDelay?: number | true };

type T_UseAsyncReturn<
	G_CallbackArgs extends unknown[],
	G_CallbackReturn,
> = T_State<G_CallbackReturn> & {
	mutation: (...args: G_CallbackArgs) => Promise<G_CallbackReturn>;
};

function useAsync<G_CallbackArgs extends unknown[], G_CallbackReturn>(
	key: string,
	callback: (...args: G_CallbackArgs) => Promise<G_CallbackReturn>,
	opts?: T_Opts,
): T_UseAsyncReturn<G_CallbackArgs, G_CallbackReturn> {
	// --- STATES & REFS ---
	const [state, dispatch] = React.useReducer(createReducer<G_CallbackReturn>(), initialState);
	const savedHandler = React.useRef<T_Callback<G_CallbackArgs, G_CallbackReturn>>(callback);

	// --- API ---
	const executeCallback: T_Callback<G_CallbackArgs, G_CallbackReturn> = React.useCallback(
		async function executeCallback(...args) {
			try {
				logger("LOG", `Mutating "${key}"...`);

				dispatch({ type: "LOADING" });
				await delay(
					opts
						? v.isNumber(opts.withDelay)
							? opts.withDelay
							: v.isBoolean(opts.withDelay)
							? 1000
							: 0
						: 0,
				);

				const result = await savedHandler.current(...args);
				dispatch({ type: "SUCCESS", payload: result });

				return result;
			} catch (err) {
				dispatch({ type: "ERROR", payload: err });
				throw err;
			}
		},
		[key, opts],
	);

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
