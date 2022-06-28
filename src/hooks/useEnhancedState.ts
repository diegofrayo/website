import * as React from "react";
import { T_ReactSetState } from "~/types";

import { isBoolean, isNumber, isString } from "~/utils/validations";

type T_UseEnhacedStateStringReturn = [
	state: string,
	setState: T_ReactSetState<string>,
	resetState: () => void,
];

type T_UseEnhacedStateBooleanReturn = [
	state: boolean,
	setState: T_ReactSetState<boolean>,
	toggleState: () => void,
	resetState: () => void,
];

type T_UseEnhacedStateNumberReturn = [
	state: number,
	setState: T_ReactSetState<number>,
	incrementState: () => void,
	decrementState: () => void,
	resetState: () => void,
];

function useEnhancedState(initialState: string): T_UseEnhacedStateStringReturn;
function useEnhancedState(initialState: boolean): T_UseEnhacedStateBooleanReturn;
function useEnhancedState(initialState: number): T_UseEnhacedStateNumberReturn;

function useEnhancedState(
	initialState: unknown,
): T_UseEnhacedStateStringReturn | T_UseEnhacedStateBooleanReturn | T_UseEnhacedStateNumberReturn {
	// states & refs
	const initialStateRef = React.useRef<typeof initialState>(initialState);
	const [enhancedState, setEnhancedState] = React.useState<typeof initialState>(initialState);

	if (isString(enhancedState)) {
		return [
			enhancedState,
			setEnhancedState,
			function resetEnhancedState(): void {
				setEnhancedState(initialStateRef.current);
			},
		];
	}

	if (isBoolean(enhancedState)) {
		return [
			enhancedState,
			setEnhancedState,
			function toggleEnhancedState(): void {
				setEnhancedState((currentValue: boolean) => !currentValue);
			},
			function resetEnhancedState(): void {
				setEnhancedState(initialStateRef.current);
			},
		];
	}

	if (isNumber(enhancedState)) {
		return [
			enhancedState,
			setEnhancedState,
			function incrementEnhancedState(): void {
				setEnhancedState((currentValue: number) => currentValue + 1);
			},
			function decrementEnhancedState(): void {
				setEnhancedState((currentValue: number) => currentValue - 1);
			},
			function resetEnhancedState(): void {
				setEnhancedState(initialStateRef.current);
			},
		];
	}

	throw new Error("Impossible state");
}

export default useEnhancedState;
