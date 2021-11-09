import * as React from "react";

import { convertToCapitalLetter } from "~/utils/strings";

function useEnhacedState(initialState: Record<any, any>): any {
  const initialStateRef = React.useRef(initialState);
  const [enhancedState, setEnhancedState] = React.useState({});

  React.useEffect(() => {
    setEnhancedState(initialStateRef.current);
  }, [initialStateRef]);

  const stateActions = Object.entries(enhancedState).reduce(
    (result, [stateItemKey, stateItemValue]) => {
      const stateItemKeyCapitalized = convertToCapitalLetter(stateItemKey);

      if (typeof stateItemValue === "boolean") {
        return {
          ...result,
          [`set${stateItemKeyCapitalized}`]: (value: boolean) =>
            setEnhancedState({ ...enhancedState, [stateItemKey]: value }),
          [`toggle${stateItemKeyCapitalized}`]: () =>
            setEnhancedState({ ...enhancedState, [stateItemKey]: !enhancedState[stateItemKey] }),
          [`reset${stateItemKeyCapitalized}`]: () =>
            setEnhancedState({
              ...enhancedState,
              [stateItemKey]: initialStateRef.current[stateItemKey],
            }),
        };
      }

      if (typeof stateItemValue === "number") {
        return {
          ...result,
          [`set${stateItemKeyCapitalized}`]: (value: number) =>
            setEnhancedState({ ...enhancedState, [stateItemKey]: value }),
          [`increment${stateItemKeyCapitalized}`]: () =>
            setEnhancedState({ ...enhancedState, [stateItemKey]: enhancedState[stateItemKey] + 1 }),
          [`decrement${stateItemKeyCapitalized}`]: () =>
            setEnhancedState({ ...enhancedState, [stateItemKey]: enhancedState[stateItemKey] - 1 }),
          [`reset${stateItemKeyCapitalized}`]: () =>
            setEnhancedState({
              ...enhancedState,
              [stateItemKey]: initialStateRef.current[stateItemKey],
            }),
        };
      }

      if (typeof stateItemValue === "string" || typeof stateItemValue === "object") {
        return {
          ...result,
          [`set${stateItemKeyCapitalized}`]: (value: string | unknown) =>
            setEnhancedState({ ...enhancedState, [stateItemKey]: value }),
          [`reset${stateItemKeyCapitalized}`]: () =>
            setEnhancedState({
              ...enhancedState,
              [stateItemKey]: initialStateRef.current[stateItemKey],
            }),
        };
      }

      return result;
    },
    {},
  );

  return {
    ...enhancedState,
    ...stateActions,
    reset: () => setEnhancedState(initialStateRef.current),
  };
}

export default useEnhacedState;
