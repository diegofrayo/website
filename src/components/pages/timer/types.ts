export type T_Routine = {
  startTime: { ms: number; formatted: string };
  endTime?: { ms: number; formatted: string };
  restTimeBetweenItems: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  stats?: T_RoutineStats;
  items: T_RoutineItem[];
};

export type T_RoutineItem = {
  id: string;
  title: string;
  highTime: string;
  sets: number;
  restTime?: string;
  status: string;
};

export type T_RoutineStats = {
  totalExercises: number;
  totalCompletedExercises: number;
  completedPercent: string;
  completedTime: string;
  totalTime: string;
  finalRoutineDuration: string;
};

export type T_TimerStatus = "NOT_STARTED" | "RUNNING" | "PAUSED";
