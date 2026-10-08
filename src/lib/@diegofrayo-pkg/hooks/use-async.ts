import { useCallback, useLayoutEffect, useMemo, useReducer, useRef } from "react";

import { attemptAsync, sleep } from "../utilities/async";
import { isBoolean, isNumber } from "../validator";
import useMountEffect from "./use-mount-effect";

type AsyncFn<AsyncFnArgs extends unknown[], AsyncFnReturn> = (
	...args: AsyncFnArgs
) => Promise<AsyncFnReturn> | AsyncFnReturn;

type UseAsyncReturnBase<AsyncFnReturn> = State<AsyncFnReturn>;

type OptsBase = {
	withDelay?: number | true;
};

type Opts1 = OptsBase & {
	autoLaunch?: true;
};

type Opts2 = OptsBase & {
	autoLaunch: false;
};

type Return1<AsyncFnReturn> = UseAsyncReturnBase<AsyncFnReturn>;

type Return2<AsyncFnArgs extends unknown[], AsyncFnReturn> = UseAsyncReturnBase<AsyncFnReturn> & {
	asyncFn: AsyncFn<AsyncFnArgs, AsyncFnReturn>;
};

function useAsync<AsyncFnArgs extends unknown[], AsyncFnReturn>(
	asyncFn: (...args: AsyncFnArgs) => Promise<AsyncFnReturn> | AsyncFnReturn,
	optsParam?: Opts1,
): Return1<AsyncFnReturn>;

function useAsync<AsyncFnArgs extends unknown[], AsyncFnReturn>(
	asyncFn: (...args: AsyncFnArgs) => Promise<AsyncFnReturn> | AsyncFnReturn,
	optsParam?: Opts2,
): Return2<AsyncFnArgs, AsyncFnReturn>;

function useAsync<AsyncFnArgs extends unknown[], AsyncFnReturn>(
	asyncFn: (...args: AsyncFnArgs) => Promise<AsyncFnReturn> | AsyncFnReturn,
	optsParam?: Opts1 | Opts2,
): Return1<AsyncFnReturn> | Return2<AsyncFnArgs, AsyncFnReturn> {
	// --- COMPUTED STATES ---
	const opts = useMemo(() => {
		return {
			autoLaunch: optsParam
				? isBoolean(optsParam["autoLaunch"])
					? optsParam["autoLaunch"]
					: true
				: true,
			withDelay: optsParam
				? isBoolean(optsParam["withDelay"])
					? 1000
					: isNumber(optsParam["withDelay"])
						? optsParam["withDelay"]
						: 0
				: 0,
		};
	}, [optsParam]);

	// --- STATES & REFS ---
	const [state, dispatch] = useReducer(createReducer<AsyncFnReturn>(), {
		...initialState,
		isLoading: opts.autoLaunch,
	});
	const savedHandler = useRef<AsyncFn<AsyncFnArgs, AsyncFnReturn>>(asyncFn);

	// --- ACTIONS ---
	const enhancedAsyncFn: AsyncFn<AsyncFnArgs, AsyncFnReturn> = useCallback(
		async function enhancedAsyncFn(...args): Promise<AsyncFnReturn> {
			try {
				dispatch({ type: "LOADING" });
				await sleep(opts.withDelay);

				const result = await savedHandler.current(...args);
				dispatch({ type: "SUCCESS", payload: result });

				return result;
			} catch (err) {
				dispatch({ type: "ERROR", payload: err as Error });
				throw err;
			}
		},
		[opts],
	);

	// --- EFFECTS ---
	// NOTE: Keep the ref pointing to the latest `asyncFn` so it never runs a stale closure
	useLayoutEffect(() => {
		savedHandler.current = asyncFn;
	}, [asyncFn]);

	useMountEffect(() => {
		if (opts.autoLaunch === true) {
			void attemptAsync(() => enhancedAsyncFn(...([] as unknown[] as AsyncFnArgs)));
		}
	});

	if (opts.autoLaunch) {
		return { ...state };
	}

	return { ...state, asyncFn: enhancedAsyncFn };
}

export default useAsync;

// --- REDUCERS ---

type State<Data> = {
	isLoading: boolean;
	data: Data | undefined;
	error: Error | undefined;
};

type Action<Data> =
	| { type: "LOADING" }
	| { type: "SUCCESS"; payload: Data }
	| { type: "ERROR"; payload: Error };

const initialState = {
	isLoading: false,
	data: undefined,
	error: undefined,
};

function createReducer<Data>() {
	return function reducer(state: State<Data>, action: Action<Data>): State<Data> {
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
				throw Error(`Unknown action: ${action["type"] as string}`);
			}
		}
	};
}
