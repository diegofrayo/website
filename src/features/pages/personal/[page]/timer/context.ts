// @ts-nocheck

import * as React from "react";

import { T_Routine, T_RoutineItem, T_TimerStatus } from "./types";

export const TimerPageContext = React.createContext({} as T_TimerPageContext);

type T_TimerPageContext = {
	// states
	currentRoutine: T_Routine;
	timerStatus: T_TimerStatus;

	// states setters
	setTimerStatus: React.Dispatch<React.SetStateAction<T_TimerStatus>>;

	// utils
	timeToSeconds: (time?: string) => number;
	secondsToTime: (seconds: number) => string;
	calculateRoutineItemTotalTime: (
		sets: T_RoutineItem["sets"],
		highTime: T_RoutineItem["highTime"],
		restTime: T_RoutineItem["restTime"],
	) => number;
	setRoutineItemAsStarted: (routine: T_Routine, routineItemId: T_RoutineItem["id"]) => void;
	markRoutineItemAsCompleted: (
		routine: T_Routine,
		routineItemId: T_RoutineItem["id"],
		routineItemStatus: T_RoutineItem["status"],
		option?: "SEARCH_FOR_NEXT_ROUTINE_ITEM",
	) => void;
	updateRoutineItem: (
		routine: T_Routine,
		routineItemId: T_RoutineItem["id"],
		payload: Partial<T_RoutineItem>,
	) => void;
};
