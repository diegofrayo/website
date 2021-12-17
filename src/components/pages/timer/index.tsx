import * as React from "react";
import { useTheme } from "next-themes";

import { Page } from "~/components/layout";
import { Block, Button, Icon, InlineText, Space, Title } from "~/components/primitive";
import { withAuth } from "~/auth";
import { useDidMount, useQuery } from "~/hooks";
import http from "~/lib/http";
import type { T_ReactElement } from "~/types";
import { setScrollPosition } from "~/utils/browser";
import { delay, pluralize, sortBy } from "~/utils/misc";

import { ROUTINE_ITEMS_STATUS, ROUTINE_STATUS, TIMER_STATUS } from "./constants";
import { Timer, GoToHomeLink, Stats, RoutineItem } from "./components";
import { TimerPageContext } from "./context";
import type { T_RoutineStats, T_Routine, T_RoutineItem, T_TimerStatus } from "./types";
import { Render } from "~/components/shared";

function TimerPage(): T_ReactElement {
  const {
    // states
    routine,
    currentRoutineItem,
    currentRoutineItemIndex,
    timerStatus,

    // states setters
    setRoutine,
    setTimerStatus,
    setCurrentRoutineItem,

    // handlers
    handleInitRoutineClick,
    handleCompleteRoutineClick,
    handleCancelRoutineClick,
    handleUploadRoutineHistoryClick,

    // vars
    routineTemplate,
    isLoading,
    error,

    // utils
    timeToSeconds,
    secondsToTime,
    fillNumber,
    getStats,
    searchForNextNotStartedRoutineItem,
    setRoutineItemAsStarted,
    updateRoutineItemStatus,
    fetchAllRoutines,
  } = useController();

  return (
    <Page
      config={{
        title: "Timer",
        disableSEO: true,
      }}
    >
      <Render isLoading={isLoading} error={error} data={routineTemplate}>
        {() => {
          return routine ? (
            <TimerPageContext.Provider
              value={{
                // states
                routine,
                currentRoutineItem,
                timerStatus,

                // states setters
                setRoutine,
                setTimerStatus,
                setCurrentRoutineItem,

                // utils
                timeToSeconds,
                secondsToTime,
                fillNumber,
                searchForNextNotStartedRoutineItem,
                setRoutineItemAsStarted,
                updateRoutineItemStatus,
              }}
            >
              <Block className="dfr-shadow tw-max-w-sm tw-mx-auto tw-relative tw-pt-8">
                <GoToHomeLink />

                {routine.status === ROUTINE_STATUS.IN_PROGRESS ? (
                  <React.Fragment>
                    {currentRoutineItem && (
                      <Timer
                        routineItem={currentRoutineItem}
                        routineItemIndex={currentRoutineItemIndex}
                      />
                    )}

                    <Block className="tw-p-2">
                      <Block className="tw-flex tw-justify-between">
                        <Button
                          variant={Button.variant.SIMPLE}
                          className="tw-text-sm"
                          onClick={handleCancelRoutineClick}
                        >
                          <Icon icon={Icon.icon.X} color="dfr-text-colorful-secondary-100" />
                          <InlineText className="tw-ml-1 tw-align-middle">
                            Cancelar rutina
                          </InlineText>
                        </Button>
                        <Button
                          variant={Button.variant.SIMPLE}
                          className="tw-text-sm"
                          onClick={handleCompleteRoutineClick}
                        >
                          <Icon icon={Icon.icon.CHECK} />
                          <InlineText className="tw-ml-1 tw-align-middle">
                            Completar rutina
                          </InlineText>
                        </Button>
                      </Block>
                      <Space size={1} />

                      <Stats data={getStats(routine)} startTime={routine.startTime} />
                      <Space size={1} />

                      <Block>
                        {routine.items.map((routineItem) => {
                          return <RoutineItem key={routineItem.id} {...routineItem} />;
                        })}
                      </Block>
                    </Block>
                  </React.Fragment>
                ) : (
                  <Block className="tw-p-8">
                    <Button
                      variant={Button.variant.SIMPLE}
                      className="tw-block tw-mx-auto tw-text-center tw-underline tw-font-bold"
                      onClick={handleInitRoutineClick}
                    >
                      Iniciar rutina
                    </Button>
                    <Space size={2} />
                    <Button
                      variant={Button.variant.SIMPLE}
                      className="tw-block tw-mx-auto tw-text-center tw-underline tw-font-bold"
                      onClick={() => {
                        if (window.confirm("¿Está seguro?")) {
                          window.localStorage.removeItem("DFR_TIMER");
                          window.location.reload();
                        }
                      }}
                    >
                      Limpiar caché
                    </Button>
                    <Space size={10} variant={Space.variant.DASHED} />

                    <Block is="section">
                      <Title is="h2" size={Title.size.MD} className="tw-text-center">
                        Historial de rutinas
                      </Title>
                      <Space size={2} />
                      {fetchAllRoutines().map(({ date, routine }) => {
                        return (
                          <React.Fragment key={date}>
                            <Stats
                              title={date}
                              data={getStats(routine)}
                              startTime={routine.startTime}
                              endTime={routine.endTime}
                              uploadRoutineHandler={handleUploadRoutineHistoryClick(date, routine)}
                            />
                            <Space size={1} />
                          </React.Fragment>
                        );
                      })}
                    </Block>
                  </Block>
                )}
              </Block>
            </TimerPageContext.Provider>
          ) : null;
        }}
      </Render>
    </Page>
  );
}

export default withAuth(TimerPage);

// --- Controller ---

function useController() {
  // hooks
  const { theme, setTheme } = useTheme();
  const {
    data: routineTemplate,
    isLoading,
    error,
  } = useQuery(
    "timer",
    async () => {
      await delay(1000);
      const { data } = await http.post(
        `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`,
        {
          path: "/timer",
          action: "GET",
        },
      );

      return data;
    },
    {
      onSuccess: (routineTemplate: T_Routine) => {
        const loadedRoutine = loadRoutine({
          ...routineTemplate,
          status: ROUTINE_STATUS.NOT_STARTED,
          startTime: new Date().getTime(),
          items: routineTemplate.items.map((item) => {
            return { ...item, status: ROUTINE_ITEMS_STATUS.NOT_STARTED };
          }),
        });
        setRoutine(loadedRoutine);

        if (loadedRoutine.status !== ROUTINE_STATUS.COMPLETED) {
          findAndLoadRoutineItem(loadedRoutine);
        }
      },
    },
  );

  // states
  const [routine, setRoutine] = React.useState<T_Routine>();
  const [currentRoutineItem, setCurrentRoutineItem] = React.useState<T_RoutineItem>();
  const [currentRoutineItemIndex, setCurrentRoutineItemIndex] = React.useState<number>(0);
  const [timerStatus, setTimerStatus] = React.useState<T_TimerStatus>(TIMER_STATUS.NOT_STARTED);

  // utils
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

  const secondsToTime = React.useCallback(function secondsToTime(seconds: number): string {
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
  }, []);

  function fillNumber(number: number): string {
    return `${number < 10 ? "0" : ""}${number}`;
  }

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

        return item;
      }),
    };

    return routineUpdated;
  },
  []);

  function searchForNextNotStartedRoutineItem(routine: T_Routine) {
    const routineItemFound =
      routine.items
        .slice(currentRoutineItemIndex)
        .find((item) => item.status === ROUTINE_ITEMS_STATUS.NOT_STARTED) ||
      routine.items
        .slice(0, currentRoutineItemIndex)
        .find((item) => item.status === ROUTINE_ITEMS_STATUS.NOT_STARTED);

    if (routineItemFound) {
      const routineUpdated = updateRoutineItemStatus(
        routine,
        routineItemFound.id,
        ROUTINE_ITEMS_STATUS.IN_PROGRESS,
      );
      const routineItemFoundIndex = routineUpdated.items.findIndex(
        (item) => item.id === routineItemFound.id,
      );

      setRoutine(routineUpdated);
      setCurrentRoutineItem(routineUpdated.items[routineItemFoundIndex]);
      setCurrentRoutineItemIndex(routineItemFoundIndex);
    } else {
      markRoutineAsCompleted();
    }
  }

  function setRoutineItemAsStarted(routine: T_Routine, routineItemId: T_RoutineItem["id"]) {
    setScrollPosition(0);

    let routineUpdated = updateRoutineItemStatus(
      routine,
      routineItemId,
      ROUTINE_ITEMS_STATUS.IN_PROGRESS,
    );

    routineUpdated = updateRoutineItemStatus(
      routineUpdated,
      currentRoutineItem?.id || "",
      ROUTINE_ITEMS_STATUS.NOT_STARTED,
    );

    const routineItemFoundIndex = routineUpdated.items.findIndex(
      (item) => item.id === routineItemId,
    );

    setRoutine(routineUpdated);
    setCurrentRoutineItem(routineUpdated.items[routineItemFoundIndex]);
    setCurrentRoutineItemIndex(routineItemFoundIndex);
  }

  function fetchAllRoutines() {
    return Object.entries(readRoutineFromLocalStorage())
      .reduce((result, [date, routine]: [string, T_Routine]) => {
        if (routine.status !== ROUTINE_STATUS.COMPLETED) return result;

        return [...result, { date, routine }];
      }, [])
      .sort(sortBy([{ param: "date", order: "desc" }]));
  }

  // private
  const saveRoutineInLocalStorage = React.useCallback(function saveRoutineInLocalStorage(
    routine?: T_Routine,
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

  function loadRoutine(defaultRoutine: T_Routine): T_Routine {
    const loadedRoutine =
      readRoutineFromLocalStorage()[new Date().toLocaleDateString()] || defaultRoutine;

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

  const getStats = React.useCallback(
    function getStats(routine?: T_Routine): T_RoutineStats {
      if (!routine) {
        return {
          totalExercises: 0,
          totalCompletedExercises: 0,
          completedPercent: "",
          completedTime: "",
          totalTime: "",
          finalRoutineDuration: "",
        };
      }

      const totalExercises = Object.keys(routine.items).length;
      const completedExercises = routine.items.filter((item) => {
        return item.status === ROUTINE_ITEMS_STATUS.COMPLETED;
      });

      return {
        totalExercises,
        totalCompletedExercises: completedExercises.length,
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
        finalRoutineDuration: routine.endTime
          ? pluralize(
              Math.ceil(Math.abs((routine.endTime - routine.startTime) / 1000) / 60),
              "minuto",
              "minutos",
            )
          : "",
      };
    },
    [timeToSeconds, secondsToTime],
  );

  function findAndLoadRoutineItem(routine: T_Routine) {
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
    setRoutine(
      updateRoutineItemStatus(
        routine,
        routine.items[routineItemToLoadIndex].id,
        ROUTINE_ITEMS_STATUS.IN_PROGRESS,
      ),
    );
  }

  function isRoutineCompleted(routine: T_Routine): boolean {
    return (
      routine.items.filter((item) => {
        return item.status === ROUTINE_ITEMS_STATUS.COMPLETED;
      }).length === routine.items.length
    );
  }

  const markRoutineAsCompleted = React.useCallback(
    function markRoutineAsCompleted() {
      const routineUpdated = {
        ...routine,
        endTime: new Date().getTime(),
        status: ROUTINE_STATUS.COMPLETED,
      } as T_Routine;

      setRoutine({ ...routineUpdated, stats: getStats(routineUpdated) });
      alert("La rutina ha sido completada!");
      window.location.reload();
    },
    [routine, getStats],
  );

  const checkRoutineItemsStatus = React.useCallback(
    function checkRoutineItemsStatus(routine: T_Routine) {
      const allRoutineItemsStatusIsNotStarted =
        routine.items.filter((item) => item.status === ROUTINE_ITEMS_STATUS.NOT_STARTED).length ===
        routine.items.length;

      if (allRoutineItemsStatusIsNotStarted) {
        setCurrentRoutineItem(routine.items[0]);
        setCurrentRoutineItemIndex(0);
        setRoutine(
          updateRoutineItemStatus(routine, routine.items[0].id, ROUTINE_ITEMS_STATUS.IN_PROGRESS),
        );
      }
    },
    [updateRoutineItemStatus],
  );

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

      const newRoutine = { ...routineTemplate, status: ROUTINE_STATUS.IN_PROGRESS };
      setRoutine(newRoutine);
      findAndLoadRoutineItem(newRoutine);
    } else {
      setRoutine({
        ...routine,
        startTime: new Date().getTime(),
        status: ROUTINE_STATUS.IN_PROGRESS,
      } as T_Routine);
    }
  }

  const handleCompleteRoutineClick = React.useCallback(
    function handleCompleteRoutineClick() {
      if (window.confirm("¿Está seguro que quiere completar la rutina? Hay items sin terminar")) {
        markRoutineAsCompleted();
      }
    },
    [markRoutineAsCompleted],
  );

  const handleCancelRoutineClick = React.useCallback(
    function handleCancelRoutineClick() {
      if (window.confirm("¿Está seguro que quiere cancelar la rutina?")) {
        saveRoutineInLocalStorage(undefined);
        setRoutine(routineTemplate);
        window.location.reload();
      }
    },
    [setRoutine, saveRoutineInLocalStorage, routineTemplate],
  );

  const handleUploadRoutineHistoryClick = React.useCallback(
    function handleUploadRoutineHistoryClick(date, routine) {
      return async () => {
        const { data } = await http.post(
          `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`,
          {
            path: "/timer",
            action: "POST",
            payload: {
              date,
              routine,
            },
          },
        );

        return data;
      };
    },
    [],
  );

  // effects
  useDidMount(() => {
    if (theme === "dark") setTheme("light");
  });

  React.useEffect(
    function onRoutineChange() {
      if (!routine) return;

      saveRoutineInLocalStorage(routine);

      if (isRoutineCompleted(routine) && routine.status !== ROUTINE_STATUS.COMPLETED) {
        markRoutineAsCompleted();
        return;
      }

      checkRoutineItemsStatus(routine);
    },
    [
      routine,
      currentRoutineItem,
      currentRoutineItemIndex,
      timerStatus,

      markRoutineAsCompleted,
      saveRoutineInLocalStorage,
      updateRoutineItemStatus,
      checkRoutineItemsStatus,
    ],
  );

  return {
    // states
    routine,
    currentRoutineItem,
    timerStatus,
    currentRoutineItemIndex,

    // states setters
    setRoutine,
    setTimerStatus,
    setCurrentRoutineItem,

    // handlers
    handleInitRoutineClick,
    handleCompleteRoutineClick,
    handleCancelRoutineClick,
    handleUploadRoutineHistoryClick,

    // vars
    routineTemplate,
    isLoading,
    error,

    // utils
    timeToSeconds,
    secondsToTime,
    fillNumber,
    getStats,
    searchForNextNotStartedRoutineItem,
    setRoutineItemAsStarted,
    updateRoutineItemStatus,
    fetchAllRoutines,
  };
}
