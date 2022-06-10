import * as React from "react";
import { T_ReactSetState } from "~/types";

import { isBoolean, isNumber } from "~/utils/validations";

type T_State = number | string | boolean;
// type T_State = unknown;

function useEnhancedState(
  state: string,
): [state: string, setState: T_ReactSetState<string>, resetState: () => void];

function useEnhancedState(
  state: number,
): [
  state: number,
  setState: T_ReactSetState<number>,
  incrementState: () => void,
  decrementState: () => void,
  resetState: () => void,
];

function useEnhancedState(
  state: boolean,
): [
  state: boolean,
  setState: T_ReactSetState<boolean>,
  toggleState: () => void,
  resetState: () => void,
];

// TODO: Type return
function useEnhancedState(initialState: T_State): unknown {
  // states & refs
  const initialStateRef = React.useRef<T_State>(initialState);
  const [enhancedState, setEnhancedState] = React.useState<T_State>(initialState);

  if (isBoolean(initialState)) {
    return [
      enhancedState,
      setEnhancedState,
      function toggleEnhancedState(): void {
        setEnhancedState((currentValue: unknown) => !currentValue as boolean);
      },
      function resetEnhancedState(): void {
        setEnhancedState(initialStateRef.current);
      },
    ];
  }

  if (isNumber(initialState)) {
    return [
      enhancedState,
      setEnhancedState,
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
    setEnhancedState,
    function resetEnhancedState(): void {
      setEnhancedState(initialStateRef.current);
    },
  ];
}

export default useEnhancedState;

// import * as React from "react";
// import { T_ReactSetState } from "~/types";

// import { isBoolean, isNumber } from "~/utils/validations";

// type T_UseEnhacedStateReturn<G_StateType> = G_StateType extends boolean
//   ? [
//       state: G_StateType,
//       setState: T_ReactSetState<boolean>,
//       toggleState: () => void,
//       resetState: () => void,
//     ]
//   : G_StateType extends number
//   ? [
//       state: G_StateType,
//       setState: T_ReactSetState<number>,
//       incrementState: () => void,
//       decrementState: () => void,
//       resetState: () => void,
//     ]
//   : [state: G_StateType, setState: T_ReactSetState<string>, resetState: () => void];

//   function useEnhancedState(state: string): string;
//   function useEnhancedState(state: number): string[];
//   function useEnhancedState(state: boolean): string[];

// function useEnhancedState<G_StateType extends boolean | number | string>(
//   initialState: G_StateType,
// ): T_UseEnhacedStateReturn<G_StateType> {
//   // states & refs
//   const initialStateRef = React.useRef<G_StateType>(initialState);
//   const [enhancedState, setEnhancedState] = React.useState<G_StateType>(initialState);

//   if (isBoolean(enhancedState)) {
//     return [
//       enhancedState,
//       // setEnhancedState,
//       // function toggleEnhancedState(): void {
//       //   setEnhancedState((currentValue) => !currentValue as G_StateType);
//       // },
//       // function resetEnhancedState(): void {
//       //   setEnhancedState(initialStateRef.current);
//       // },
//     ];
//   }

//   if (isNumber(enhancedState)) {
//     return [
//       enhancedState,
//       setEnhancedState,
//       function incrementEnhancedState(): void {
//         setEnhancedState((currentValue) => (currentValue + 1) as G_StateType);
//       },
//       function decrementEnhancedState(): void {
//         setEnhancedState((currentValue) => (currentValue - 1) as G_StateType);
//       },
//       function resetEnhancedState(): void {
//         setEnhancedState(initialStateRef.current);
//       },
//     ];
//   }

//   return [
//     enhancedState,
//     setEnhancedState,
//     function resetEnhancedState(): void {
//       setEnhancedState(initialStateRef.current);
//     },
//   ];
// }

// export default useEnhancedState;
