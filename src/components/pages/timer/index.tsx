import * as React from "react";
import { useTheme } from "next-themes";

import { Page } from "~/components/layout";
import { Block, Button, Icon, InlineText, Space } from "~/components/primitive";
import { withAuth } from "~/auth";
import { useDidMount } from "~/hooks";
import type { T_ReactElement } from "~/types";

import { ROUTINE_ITEMS_STATUS, ROUTINE_STATUS, TIMER_STATUS } from "./constants";
import { Timer, GoToHomeLink, Stats, RoutineItem } from "./components";
import { TimerPageContext } from "./context";
import type { T_RoutineStats, T_Routine, T_RoutineItem, T_TimerStatus } from "./types";

function TimerPage(): T_ReactElement {
  const {
    // states
    routine,
    currentRoutineItem,
    timerStatus,

    // states setters
    setTimerStatus,

    // handlers
    handleInitRoutineClick,
    handleCompleteRoutineClick,

    // vars
    isRoutineInProgress,
    stats,

    // utils
    timeToSeconds,
    secondsToTime,
    fillNumber,
  } = useController();

  return (
    <Page
      config={{
        title: "Timer",
        disableSEO: true,
      }}
    >
      {routine ? (
        <TimerPageContext.Provider
          value={{
            // states
            timerStatus,

            // states setters
            setTimerStatus,

            // utils
            timeToSeconds,
            secondsToTime,
            fillNumber,
          }}
        >
          <Block className="dfr-shadow tw-max-w-sm tw-mx-auto">
            <GoToHomeLink />

            {isRoutineInProgress ? (
              <React.Fragment>
                {currentRoutineItem && <Timer routineItem={currentRoutineItem} />}

                <Block className="tw-p-2">
                  <Block className="tw-text-right">
                    <Button
                      variant={Button.variant.SIMPLE}
                      className="tw-text-sm"
                      onClick={handleCompleteRoutineClick}
                    >
                      <Icon icon={Icon.icon.CHECK} />
                      <InlineText className="tw-ml-1">Completar rutina</InlineText>
                    </Button>
                  </Block>
                  <Space size={1} />

                  <Stats data={stats} startTime={routine.startTime} />
                  <Space size={1} />

                  <Block>
                    {routine.items.map((routineItem) => {
                      return <RoutineItem key={routineItem.id} {...routineItem} />;
                    })}
                  </Block>
                </Block>
              </React.Fragment>
            ) : (
              <Block className="tw-p-8 tw-text-center">
                <Button
                  variant={Button.variant.SIMPLE}
                  className="tw-underline tw-font-bold"
                  onClick={handleInitRoutineClick}
                >
                  Iniciar rutina
                </Button>
              </Block>
            )}
          </Block>
        </TimerPageContext.Provider>
      ) : null}
    </Page>
  );
}

export default withAuth(TimerPage);

// --- Controller ---

function useController() {
  // hooks
  const { theme, setTheme } = useTheme();

  // states
  const [routine, setRoutine] = React.useState<T_Routine>();
  const [currentRoutineItem, setCurrentRoutineItem] = React.useState<T_RoutineItem | null>(null);
  const [currentRoutineItemIndex, setCurrentRoutineItemIndex] = React.useState<number>(0);
  const [timerStatus, setTimerStatus] = React.useState<T_TimerStatus>(TIMER_STATUS.NOT_STARTED);

  // utils
  const updateRoutineItemStatus = React.useCallback(function updateRoutineItemStatus(
    routine: T_Routine,
    routineItemId: T_RoutineItem["id"],
    routineItemStatus: T_RoutineItem["status"],
  ): T_Routine {
    const routineUpdated = {
      ...routine,
      items: routine.items.map((item) => {
        if (item.id === routineItemId) {
          return {
            ...item,
            status: routineItemStatus,
          };
        }

        return {
          ...item,
          status:
            item.status === ROUTINE_ITEMS_STATUS.IN_PROGRESS
              ? ROUTINE_ITEMS_STATUS.NOT_STARTED
              : item.status,
        };
      }),
    };

    setRoutine(routineUpdated);

    return routineUpdated;
  },
  []);

  // function setRoutineItemAsStarted(routine, routineItemId) {
  //   const selectedItemIndex = routine.items.findIndex((item) => item.id === routineItemId);

  //   if (selectedItemIndex !== -1) {
  //     setCurrentRoutineItem(routine.items[selectedItemIndex]);
  //     setCurrentRoutineItemIndex(selectedItemIndex);
  //     setScrollPosition(0);
  //     updateRoutineItemStatus(routine, routineItemId, ROUTINE_ITEMS_STATUS.IN_PROGRESS);
  //   } else {
  //     alert("Error");
  //   }
  // }

  // function findNextRoutineItemToStart(routine) {
  //   updateRoutineItemStatus(routine, currentRoutineItem?.id, ROUTINE_ITEMS_STATUS.COMPLETED);

  //   const routineItemToStart = routine.items
  //     .slice(currentRoutineItemIndex)
  //     .find((item) => item.status === ROUTINE_ITEMS_STATUS.NOT_STARTED);

  //   if (routineItemToStart) {
  //     setRoutineItemAsStarted(routine, routineItemToStart.id);
  //   } else if (areAllRoutineItemsCompleted()) {
  //     alert("Routine finished");
  //   }
  // }

  const timeToSeconds = React.useCallback(function timeToSeconds(time?: string): number {
    if (!time || time.split(":").length === 0) return 0;

    const [hours, minutes, seconds] = time.split(":").map(Number);

    if (minutes === undefined && seconds === undefined) {
      return hours;
    }

    if (seconds === undefined) {
      return hours * 60 + minutes;
    }

    return hours * 60 * 60 + minutes * 60 + seconds + seconds;
  }, []);

  function secondsToTime(seconds: number): string {
    if (seconds < 60) {
      return `00:${fillNumber(seconds)}`;
    }

    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${fillNumber(minutes)}:${fillNumber(seconds % 60)}`;
    }

    const hours = Math.floor(seconds / (60 * 60));
    const minutes = seconds / 60 - 60 * hours;
    const lastSeconds = Math.round((minutes - Math.floor(minutes)) * 60);

    return `${fillNumber(hours)}:${fillNumber(Math.floor(minutes))}:${fillNumber(lastSeconds)}`;
  }

  function fillNumber(number: number): string {
    return `${number < 10 ? "0" : ""}${number}`;
  }

  // handlers
  function handleInitRoutineClick() {
    const loadedRoutineFromLocalStorage =
      readRoutineFromLocalStorage()[new Date().toLocaleDateString()];

    const thisRoutineWasCompletedPreviously =
      loadedRoutineFromLocalStorage?.status === ROUTINE_STATUS.COMPLETED;

    if (thisRoutineWasCompletedPreviously) {
      const userCanceledRoutineRestarting = !window.confirm(
        "Una rutina ya fue completada el día de hoy. ¿Está seguro que quiere iniciar una nueva rutina y sobre-escribir los datos de la rutina existente?",
      );

      if (userCanceledRoutineRestarting) return;
    }

    setRoutine({
      ...routine,
      startTime: `${new Date().toLocaleDateString()} || ${new Date().toLocaleTimeString()}`,
      status: ROUTINE_STATUS.IN_PROGRESS,
    } as T_Routine);
  }

  function handleCompleteRoutineClick() {
    if (window.confirm("¿Está seguro que quiere completar la rutina? Hay items sin terminar")) {
      setRoutine({
        ...routine,
        endTime: `${new Date().toLocaleDateString()} || ${new Date().toLocaleTimeString()}`,
        status: ROUTINE_STATUS.COMPLETED,
      } as T_Routine);

      alert("La rutina ha sido completada!");
    }
  }

  // private
  const saveRoutineInLocalStorage = React.useCallback(function saveRoutineInLocalStorage(
    routine: T_Routine,
  ) {
    const loadedRoutine = readRoutineFromLocalStorage();

    window.localStorage.setItem(
      "DFR_TIMER",
      JSON.stringify({
        ...loadedRoutine,
        [new Date().toLocaleDateString()]: routine,
      }),
    );
  },
  []);

  function loadRoutine(): T_Routine {
    const DEFAULT_ROUTINE = {
      restTimeBetweenItems: "01:00",
      startTime: "",
      endTime: "",
      status: ROUTINE_STATUS.NOT_STARTED,
      items: [
        {
          id: "calentamiento",
          title: "Calentamiento",
          highTime: "12:00",
          sets: 1,
          status: ROUTINE_ITEMS_STATUS.NOT_STARTED,
        },
        {
          id: "tests",
          title: "tests",
          highTime: "00:03",
          sets: 3,
          restTime: "00:02",
          status: ROUTINE_ITEMS_STATUS.NOT_STARTED,
        },
        {
          id: "pelota",
          title: "Pelota",
          highTime: "02:00",
          sets: 3,
          restTime: "01:00",
          status: ROUTINE_ITEMS_STATUS.NOT_STARTED,
        },
        {
          id: "abdominales",
          title: "Abdominales",
          highTime: "00:50",
          sets: 5,
          restTime: "00:30",
          status: ROUTINE_ITEMS_STATUS.NOT_STARTED,
        },
        {
          id: "lumbares",
          title: "Lumbares",
          highTime: "00:50",
          sets: 2,
          restTime: "00:30",
          status: ROUTINE_ITEMS_STATUS.NOT_STARTED,
        },
        {
          id: "flexiones",
          title: "Flexiones",
          highTime: "00:50",
          sets: 2,
          restTime: "00:30",
          status: ROUTINE_ITEMS_STATUS.NOT_STARTED,
        },
        {
          id: "sentadillas",
          title: "Sentadillas",
          highTime: "00:50",
          sets: 2,
          restTime: "00:30",
          status: ROUTINE_ITEMS_STATUS.NOT_STARTED,
        },
        {
          id: "fortalecimiento-1",
          title: "Fortalecimiento 1",
          highTime: "01:10",
          sets: 3,
          restTime: "00:30",
          status: ROUTINE_ITEMS_STATUS.NOT_STARTED,
        },
        {
          id: "fortalecimiento-2",
          title: "Fortalecimiento 2",
          highTime: "00:35",
          sets: 3,
          restTime: "00:35",
          status: ROUTINE_ITEMS_STATUS.NOT_STARTED,
        },
        {
          id: "fondos",
          title: "Fondos",
          highTime: "01:00",
          sets: 3,
          restTime: "00:30",
          status: ROUTINE_ITEMS_STATUS.NOT_STARTED,
        },
        {
          id: "pecho",
          title: "Pecho",
          highTime: "02:00",
          sets: 3,
          restTime: "01:00",
          status: ROUTINE_ITEMS_STATUS.NOT_STARTED,
        },
        {
          id: "brazo",
          title: "Brazo",
          highTime: "02:00",
          sets: 3,
          restTime: "01:00",
          status: ROUTINE_ITEMS_STATUS.NOT_STARTED,
        },
        {
          id: "5",
          title: "Yoga",
          highTime: "15:00",
          sets: 1,
          status: ROUTINE_ITEMS_STATUS.NOT_STARTED,
        },
      ],
    };
    const loadedRoutine =
      readRoutineFromLocalStorage()[new Date().toLocaleDateString()] || DEFAULT_ROUTINE;

    return loadedRoutine;
  }

  function readRoutineFromLocalStorage() {
    try {
      return JSON.parse((window.localStorage.getItem("DFR_TIMER") || "") as string);
    } catch (error) {
      console.error(error);
      return {};
    }
  }

  // function areAllRoutineItemsCompleted(routine) {
  //   return (
  //     routine.items.filter((item) => {
  //       return item.status === ROUTINE_ITEMS_STATUS.COMPLETED;
  //     }).length === routine.items.length
  //   );
  // }

  function getStats(routine?: T_Routine): T_RoutineStats {
    if (!routine) {
      return { totalExercises: 0, completedPercent: "", completedTime: "", totalTime: "" };
    }

    const totalExercises = Object.keys(routine.items).length;
    const completedExercises = routine.items.filter((item) => {
      return item.status === ROUTINE_ITEMS_STATUS.COMPLETED;
    });

    return {
      totalExercises,
      completedPercent: `${Math.round((completedExercises.length / totalExercises) * 100)}%`,
      completedTime: secondsToTime(
        completedExercises.length > 0
          ? completedExercises
              .map((item) => {
                return (
                  timeToSeconds(item.highTime) * item.sets +
                  timeToSeconds(item.restTime) * (item.sets - 1)
                );
              })
              .reduce((result, curr) => result + curr, 0) +
              timeToSeconds(routine.restTimeBetweenItems) * (completedExercises.length - 1)
          : 0,
      ),
      totalTime: secondsToTime(
        routine.items
          .map((item) => {
            return (
              timeToSeconds(item.highTime) * item.sets +
              timeToSeconds(item.restTime) * (item.sets - 1)
            );
          })
          .reduce((result, curr) => result + curr, 0) +
          timeToSeconds(routine.restTimeBetweenItems) * (totalExercises - 1),
      ),
    };
  }

  // function findRoutineItemToStart(routine) {
  //   const routineItemToStart =
  //     routine.items.find((item) => item.status === ROUTINE_ITEMS_STATUS.IN_PROGRESS) ||
  //     routine.items.find((item) => item.status === ROUTINE_ITEMS_STATUS.NOT_STARTED);

  //   setCurrentRoutineItem(routineItemToStart);
  //   updateRoutineItemStatus(routine, routineItemToStart.id, ROUTINE_ITEMS_STATUS.IN_PROGRESS);
  // }

  function checkIfRoutineIsInProgress(routine?: T_Routine): boolean {
    if (!routine) return false;
    return routine.status === ROUTINE_STATUS.IN_PROGRESS;
  }

  function findAndLoadARoutineItem(routine: T_Routine) {
    const routineItemIndexInProgress = routine.items.findIndex(
      (item) => item.status === ROUTINE_ITEMS_STATUS.IN_PROGRESS,
    );
    const routineItemIndexNotStarted = routine.items.findIndex(
      (item) => item.status === ROUTINE_ITEMS_STATUS.NOT_STARTED,
    );
    const routineItemToLoadIndex =
      routineItemIndexInProgress !== -1
        ? routineItemIndexInProgress
        : routineItemIndexNotStarted !== -1
        ? routineItemIndexNotStarted
        : -1;

    if (routineItemToLoadIndex === -1) {
      throw new Error("This routine does not have items or already was completed");
    }

    setCurrentRoutineItem(routine.items[routineItemToLoadIndex]);
    setCurrentRoutineItemIndex(routineItemToLoadIndex);
    updateRoutineItemStatus(
      routine,
      routine.items[routineItemToLoadIndex].id,
      ROUTINE_ITEMS_STATUS.IN_PROGRESS,
    );
  }

  // effects
  useDidMount(() => {
    if (theme === "dark") setTheme("light");

    const loadedRoutine = loadRoutine();
    setRoutine(loadedRoutine);
    findAndLoadARoutineItem(loadedRoutine);
  });

  React.useEffect(
    function onRoutineChange() {
      if (!routine) return;

      saveRoutineInLocalStorage(routine);
    },
    [
      routine,
      saveRoutineInLocalStorage,
      currentRoutineItemIndex,
      currentRoutineItem,
      timerStatus,
      updateRoutineItemStatus,
    ],
  );

  return {
    // states
    routine,
    currentRoutineItem,
    timerStatus,

    // states setters
    setTimerStatus,

    // handlers
    handleInitRoutineClick,
    handleCompleteRoutineClick,

    // vars
    isRoutineInProgress: checkIfRoutineIsInProgress(routine),
    stats: getStats(routine),

    // utils
    timeToSeconds,
    secondsToTime,
    fillNumber,
  };
}
