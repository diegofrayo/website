import * as React from "react";

import { T_TimerStatus } from "./types";

export const TimerPageContext = React.createContext({} as T_TimerPageContext);

type T_TimerPageContext = {
  // states
  timerStatus: T_TimerStatus;

  // states setters
  setTimerStatus: React.Dispatch<React.SetStateAction<T_TimerStatus>>;

  // utils
  timeToSeconds: (time?: string) => number;
  secondsToTime: (seconds: number) => string;
  fillNumber: (number: number) => string;
};
