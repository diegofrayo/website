import { useState } from "react";

import { T_Function } from "~/types";

import useDidMount from "./useDidMount";

// TODO: Type this
type T_Data = any;

function useExecuteCallback(
  callback: T_Function<Promise<T_Data> | T_Data>,
): {
  isLoading: boolean;
  data: T_Data;
  error: Error | undefined;
} {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);

  useDidMount(() => {
    const executeCallback = async () => {
      try {
        const result = await callback();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    executeCallback();
  });

  return { isLoading, data, error };
}

export default useExecuteCallback;
