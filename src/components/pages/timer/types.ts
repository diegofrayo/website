export type T_Routine = {
  startTime: string;
  endTime: string;
  restTimeBetweenItems: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
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
  completedPercent: string;
  completedTime: string;
  totalTime: string;
};

export type T_TimerStatus = "NOT_STARTED" | "RUNNING" | "PAUSED";
