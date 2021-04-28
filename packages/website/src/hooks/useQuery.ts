import { useQuery as useReactQuery } from "react-query";

import { delay } from "~/utils/misc";

function useQuery<T_Data>(
  key: string,
  handler: () => Promise<T_Data> | T_Data,
): { isLoading: boolean; error: unknown; data: T_Data | undefined } {
  const { isLoading, error, data } = useReactQuery<T_Data>(key, async () => {
    await delay(1000);
    return handler();
  });

  return { isLoading, error, data };
}

export default useQuery;
