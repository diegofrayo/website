import { useQuery as useReactQuery } from "react-query";

import { delay } from "~/utils/misc";

function useQuery(
  key: string,
  handler: () => unknown,
): { isLoading: boolean; error: unknown; data: any } {
  const { isLoading, error, data } = useReactQuery(key, async () => {
    await delay(1000);
    return handler();
  });

  return { isLoading, error, data };
}

export default useQuery;
