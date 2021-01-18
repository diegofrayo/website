import { useQuery as useReactQuery } from "react-query";

import { delay } from "~/utils/misc";

function useQuery(key, handler) {
  const { isLoading, error, data } = useReactQuery(key, async () => {
    await delay(1000);
    return handler();
  });

  return { isLoading, error, data };
}

export default useQuery;
