import * as React from "react";
import { T_ReactSetState } from "~/types";

import { isBoolean, isNumber } from "~/utils/validations";

type T_UseEnhacedStateStringReturn = [
  state: string,
  setState: T_ReactSetState<string>,
  resetState: () => void,
];

type T_UseEnhacedStateNumberReturn = [
  state: number,
  setState: T_ReactSetState<number>,
  incrementState: () => void,
  decrementState: () => void,
  resetState: () => void,
];

type T_UseEnhacedStateBooleanReturn = [
  state: boolean,
  setState: T_ReactSetState<boolean>,
  toggleState: () => void,
  resetState: () => void,
];

function useEnhancedState(
  initialState: number | string | boolean,
): T_UseEnhacedStateStringReturn | T_UseEnhacedStateNumberReturn | T_UseEnhacedStateBooleanReturn {
  // states & refs
  const initialStateRef = React.useRef<typeof initialState>(initialState);
  const [enhancedState, setEnhancedState] = React.useState<typeof initialState>(initialState);

  if (isBoolean(enhancedState)) {
    return [
      enhancedState,
      setEnhancedState as T_ReactSetState<boolean>,
      function toggleEnhancedState(): void {
        setEnhancedState((currentValue: unknown) => !currentValue as boolean);
      },
      function resetEnhancedState(): void {
        setEnhancedState(initialStateRef.current);
      },
    ];
  }

  if (isNumber(enhancedState)) {
    return [
      enhancedState,
      setEnhancedState as T_ReactSetState<number>,
      function incrementEnhancedState(): void {
        setEnhancedState((currentValue: unknown) => (currentValue as number) + 1);
      },
      function decrementEnhancedState(): void {
        setEnhancedState((currentValue: unknown) => (currentValue as number) - 1);
      },
      function resetEnhancedState(): void {
        setEnhancedState(initialStateRef.current);
      },
    ];
  }

  return [
    enhancedState,
    setEnhancedState as T_ReactSetState<string>,
    function resetEnhancedState(): void {
      setEnhancedState(initialStateRef.current);
    },
  ];
}

export default useEnhancedState;
