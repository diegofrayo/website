export type T_RoutinesTemplatesResponse = {
  metadata: { version: string; routineItemsStartTime: number };
  exercises: Record<string, T_RoutineItem>;
  routines: T_Routine[];
};

export interface T_Routine {
  id: string;
  items: T_RoutineItem[];
  name: string;
  restTimeBetweenItems: string;

  endTime?: { ms: number; formatted: string };
  startTime: { ms: number; formatted: string };
  stats?: T_RoutineStats;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
}

export type T_RoutineItem = {
  highTime: string;
  restTime: string;
  sets: number;
  title: string;
  id: string;

  status: string;
};

export type T_RoutineStats = {
  totalExercises: number;
  totalCompletedExercises: number;
  completedPercent: string;
  completedTime: string;
  totalTime: string;
  finalRoutineDuration: string;
  remainingTime: string;
};

export type T_TimerStatus = "NOT_STARTED" | "RUNNING" | "PAUSED";
