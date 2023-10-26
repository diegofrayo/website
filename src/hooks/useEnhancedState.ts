import * as React from "react";
import type DR from "@diegofrayo/types";
import v from "@diegofrayo/v";

type T_UseEnhacedStateStringReturn = [
	state: string,
	setState: DR.React.SetState<string>,
	resetState: () => void,
];

type T_UseEnhacedStateBooleanReturn = [
	state: boolean,
	setState: DR.React.SetState<boolean>,
	toggleState: () => void,
	resetState: () => void,
];

type T_UseEnhacedStateNumberReturn = [
	state: number,
	setState: DR.React.SetState<number>,
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
	// --- STATES & REFS ---
	const initialStateRef = React.useRef<typeof initialState>(initialState);
	const [enhancedState, setEnhancedState] = React.useState<typeof initialState>(initialState);

	if (v.isString(enhancedState)) {
		return [
			enhancedState,
			setEnhancedState,
			function resetEnhancedState(): void {
				setEnhancedState(initialStateRef.current);
			},
		];
	}

	if (v.isBoolean(enhancedState)) {
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

	if (v.isNumber(enhancedState)) {
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
