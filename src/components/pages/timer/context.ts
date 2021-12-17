import * as React from "react";

import { T_Routine, T_RoutineItem, T_TimerStatus } from "./types";

export const TimerPageContext = React.createContext({} as T_TimerPageContext);

type T_TimerPageContext = {
  // states
  routine: T_Routine;
  timerStatus: T_TimerStatus;
  currentRoutineItem?: T_RoutineItem;

  // states setters
  setRoutine: React.Dispatch<React.SetStateAction<T_Routine>>;
  setTimerStatus: React.Dispatch<React.SetStateAction<T_TimerStatus>>;
  setCurrentRoutineItem: React.Dispatch<React.SetStateAction<T_RoutineItem>>;

  // utils
  timeToSeconds: (time?: string) => number;
  secondsToTime: (seconds: number) => string;
  fillNumber: (number: number) => string;
  updateRoutineItemStatus: (
    routine: T_Routine,
    routineItemId: T_RoutineItem["id"],
    routineItemStatus: T_RoutineItem["status"],
  ) => T_Routine;
  searchForNextNotStartedRoutineItem: (routine: T_Routine) => void;
  setRoutineItemAsStarted: (routine: T_Routine, routineItemId: T_RoutineItem["id"]) => void;
};
