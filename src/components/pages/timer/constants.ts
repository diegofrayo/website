import { T_Routine, T_TimerStatus } from "./types";

export const ROUTINE_STATUS: Record<T_Routine["status"], T_Routine["status"]> = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
};

export const ROUTINE_ITEMS_STATUS: Record<
  T_Routine["status"],
  "sin iniciar" | "en progreso" | "completado"
> = {
  NOT_STARTED: "sin iniciar",
  IN_PROGRESS: "en progreso",
  COMPLETED: "completado",
};

export const TIMER_STATUS: Record<T_TimerStatus, T_TimerStatus> = {
  NOT_STARTED: "NOT_STARTED",
  RUNNING: "RUNNING",
  PAUSED: "PAUSED",
};
