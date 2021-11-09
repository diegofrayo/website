import * as React from "react";

type T_Data = any;
type T_Params = any;
type T_Callback = (params: T_Params) => Promise<T_Data> | T_Data;

function useExecuteCallback(
  params: T_Params,
  callback: T_Callback,
): {
  isLoading: boolean;
  data: T_Data;
  error: Error | undefined;
} {
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState(undefined);
  const [error, setError] = React.useState(undefined);
  const savedHandler = React.useRef(callback);

  React.useEffect(function updateCallbackRef() {
    savedHandler.current = callback;
  });

  React.useEffect(
    function executeCallback() {
      const executeCallback = async (params) => {
        try {
          const result = await savedHandler.current(params);
          setData(result);
          setError(undefined);
        } catch (error) {
          setData(undefined);
          setError(error);
        } finally {
          setIsLoading(false);
        }
      };

      executeCallback(params);
    },
    [params],
  );

  return { isLoading, data, error };
}

export default useExecuteCallback;
