import { useQuery as useReactQuery } from "react-query";

import { logAndReportError } from "~/features/errors-logging";
import { delay } from "~/utils/misc";
import type { T_UnknownObject } from "~/types";

function useQuery<G_Data>(
	key: string,
	handler: () => Promise<G_Data> | G_Data,
	options?: T_UnknownObject,
): { isLoading: boolean; error: unknown; data: G_Data | undefined } {
	const { isLoading, error, data } = useReactQuery<G_Data>(
		key,
		async () => {
			try {
				await delay(500);
				return await handler();
			} catch (e) {
				logAndReportError(e, "useQuery");
				throw error;
			}
		},
		options,
	);

	return { isLoading, error, data };
}

export default useQuery;
