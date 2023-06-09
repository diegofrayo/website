import * as React from "react";

type T_Callback<G_Params, G_Data> = (params: G_Params) => Promise<G_Data> | G_Data;
type T_UseExecuteCallbackReturn<G_Data> = {
	isLoading: boolean;
	data: G_Data | undefined;
	error: unknown;
};

function useAsync<G_Params = unknown, G_Data = unknown>(
	params: G_Params,
	callback: T_Callback<G_Params, G_Data>,
): T_UseExecuteCallbackReturn<G_Data> {
	// --- STATES & REFS ---
	const [isLoading, setIsLoading] = React.useState(true);
	const [data, setData] = React.useState<G_Data | undefined>(undefined);
	const [error, setError] = React.useState<unknown>(undefined);
	const savedHandler = React.useRef<typeof callback>(callback);

	// --- EFFECTS ---
	React.useEffect(() => {
		savedHandler.current = callback;
	});

	React.useEffect(() => {
		const executeCallback = async (params: G_Params): Promise<void> => {
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

export default useAsync;
