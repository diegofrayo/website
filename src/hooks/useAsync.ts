/* eslint @typescript-eslint/dot-notation: 0 */

import * as React from "react";

import { logger } from "~/modules/logging";
import { delay } from "@diegofrayo/utils/misc";
import v from "@diegofrayo/v";

import useDidMount from "./useDidMount";

type T_AsyncFn<G_AsyncFnArgs extends unknown[], G_AsyncFnReturn> = (
	...args: G_AsyncFnArgs
) => Promise<G_AsyncFnReturn>;

type T_Opts = {
	autoLaunch?: boolean;
	withDelay?: number | true;
};

type T_UseAsyncReturn<
	G_AsyncFnArgs extends unknown[],
	G_AsyncFnReturn,
> = T_State<G_AsyncFnReturn> & {
	asyncFn: T_AsyncFn<G_AsyncFnArgs, G_AsyncFnReturn>;
};

function useAsync<G_AsyncFnArgs extends unknown[], G_AsyncFnReturn>(
	key: string,
	asyncFn: (...args: G_AsyncFnArgs) => Promise<G_AsyncFnReturn>,
	optsParam?: T_Opts,
): T_UseAsyncReturn<G_AsyncFnArgs, G_AsyncFnReturn> {
	// --- VARS ---
	const opts = React.useMemo(() => {
		return {
			autoLaunch: optsParam
				? v.isBoolean(optsParam?.autoLaunch)
					? optsParam?.autoLaunch
					: true
				: true,
			withDelay: optsParam
				? v.isBoolean(optsParam.withDelay)
					? 1000
					: v.isNumber(optsParam.withDelay)
					? optsParam.withDelay
					: 0
				: 0,
		};
	}, [optsParam]);

	// --- STATES & REFS ---
	const [state, dispatch] = React.useReducer(createReducer<G_AsyncFnReturn>(), {
		...initialState,
		isLoading: opts.autoLaunch,
	});
	const savedHandler = React.useRef<T_AsyncFn<G_AsyncFnArgs, G_AsyncFnReturn>>(asyncFn);

	// --- EFFECTS ---
	useDidMount(() => {
		if (opts.autoLaunch === true) {
			// @ts-ignore
			enhancedAsyncFn();
		}
	});

	// --- API ---
	const enhancedAsyncFn: T_AsyncFn<G_AsyncFnArgs, G_AsyncFnReturn> = React.useCallback(
		async function enhancedAsyncFn(...args) {
			try {
				logger("LOG", `Executing "${key}"...`);

				dispatch({ type: "LOADING" });
				await delay(opts.withDelay);

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

	return {
		...state,
		asyncFn: enhancedAsyncFn,
		// ...(opts.autoLaunch ? {} : { asyncFn: enhancedAsyncFn }), // TODO
	};
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
