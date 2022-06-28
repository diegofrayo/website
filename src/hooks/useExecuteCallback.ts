import * as React from "react";

type T_Data = unknown;
type T_Params = unknown;
type T_Callback = (params: T_Params) => Promise<T_Data> | T_Data;
type T_Error = Error | unknown | undefined;

function useExecuteCallback(
	params: T_Params,
	callback: T_Callback,
): {
	isLoading: boolean;
	data: T_Data;
	error: T_Error;
} {
	// states & refs
	const [isLoading, setIsLoading] = React.useState(true);
	const [data, setData] = React.useState<T_Data>(undefined);
	const [error, setError] = React.useState<T_Error>(undefined);
	const savedHandler = React.useRef<T_Callback>(callback);

	// effects
	React.useEffect(() => {
		savedHandler.current = callback;
	});

	React.useEffect(() => {
		const executeCallback: T_Callback = async (params) => {
			try {
				setIsLoading(true);

				const result = await savedHandler.current(params);
				setData(result);
				setError(undefined);
			} catch (e) {
				setData(undefined);
				setError(e);
			} finally {
				setIsLoading(false);
			}
		};

		executeCallback(params);
	}, [params]);

	return { isLoading, data, error };
}

export default useExecuteCallback;
