import { useQuery as useReactQuery } from "react-query";

import { delay } from "~/utils/misc";
import type { T_Object } from "~/types";

function useQuery<G_Data>(
	key: string,
	handler: () => Promise<G_Data> | G_Data,
	options?: T_Object,
): { isLoading: boolean; error: unknown; data: G_Data | undefined } {
	const { isLoading, error, data } = useReactQuery<G_Data>(
		key,
		async () => {
			await delay(500);
			return handler();
		},
		options,
	);

	return { isLoading, error, data };
}

export default useQuery;
