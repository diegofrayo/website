import * as React from "react";
import { useTheme } from "next-themes";

import { Page } from "~/components/layout";
import { Block, Button, Icon, InlineText, Space, Text, Title } from "~/components/primitive";
import { withAuth } from "~/auth";
import { useDidMount, useQuery } from "~/hooks";
import http from "~/lib/http";
import type { T_ReactElement } from "~/types";
import { setScrollPosition } from "~/utils/browser";
import { delay, isDevelopmentEnvironment, sortBy } from "~/utils/misc";
import { ROUTES } from "~/utils/routing";

import { ROUTINE_ITEMS_STATUS, ROUTINE_STATUS, TIMER_STATUS } from "./constants";
import { Timer, Stats, RoutineItem } from "./components";
import { TimerPageContext } from "./context";
import type { T_RoutineStats, T_Routine, T_RoutineItem, T_TimerStatus } from "./types";
import { Render } from "~/components/shared";

function TimerPage(): T_ReactElement {
  const {
    // states
    currentRoutine,
    currentRoutineItem,
    currentRoutineItemIndex,
    timerStatus,
    routinesHistory,

    // states setters
    setTimerStatus,

    // handlers
    handleInitRoutineClick,
    handleCompleteRoutineClick,
    handleCancelRoutineClick,
    handleUploadRoutineHistoryClick,
    handleDeleteRoutineHistoryClick,

    // vars
    routinesTemplates,
    isLoading,
    error,

    // utils
    timeToSeconds,
    secondsToTime,
    getStats,
    markRoutineItemAsCompleted,
    calculateRoutineItemTotalTime,
    setRoutineItemAsStarted,
  } = useController();

  return (
    <Page
      config={{
        title: "Timer",
        disableSEO: true,
      }}
    >
      <Render isLoading={isLoading} error={error} data={routinesTemplates}>
        {() => {
          return currentRoutine ? (
            <TimerPageContext.Provider
              value={{
                // states
                currentRoutine,
                timerStatus,

                // states setters
                setTimerStatus,

                // utils
                timeToSeconds,
                secondsToTime,
                calculateRoutineItemTotalTime,
                setRoutineItemAsStarted,
                markRoutineItemAsCompleted,
              }}
            >
              <Block className="tw-shadow-md tw-shadow-gray-600 dfr-bg-color-light-strong tw-max-w-sm tw-mx-auto tw-relative tw-pt-8 tw-min-h-screen">
                <GoToHomeLink />

                {currentRoutine.status === ROUTINE_STATUS.IN_PROGRESS ? (
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

                      <Stats
                        data={getStats(currentRoutine)}
                        name={currentRoutine.name}
                        startTime={currentRoutine.startTime}
                      />
                      <Space size={4} variant={Space.variant.DASHED} />

                      <Block>
                        {currentRoutine.items.map((routineItem) => {
                          return <RoutineItem key={routineItem.id} {...routineItem} />;
                        })}
                      </Block>
                    </Block>
                  </React.Fragment>
                ) : (
                  <Block is="section" className="tw-p-8">
                    <Block>
                      <Title is="h2" size={Title.size.MD} className="tw-text-center">
                        Elige una rutina
                      </Title>
                      <Space size={2} />
                      {routinesTemplates.map((routineTemplate) => {
                        return (
                          <Block
                            key={routineTemplate.id}
                            className="tw-flex tw-justify-between tw-items-start tw-my-1"
                          >
                            <Text>- {routineTemplate.name}</Text>
                            <Button
                              variant={Button.variant.SIMPLE}
                              className="tw-underline tw-font-bold tw-flex-shrink-0 tw-ml-2"
                              onClick={handleInitRoutineClick(routineTemplate)}
                            >
                              Iniciar rutina
                            </Button>
                          </Block>
                        );
                      })}
                    </Block>
                    <Space size={10} variant={Space.variant.DASHED} />

                    {routinesHistory.length > 0 ? (
                      <React.Fragment>
                        <Block is="section">
                          <Title is="h2" size={Title.size.MD} className="tw-text-center">
                            Historial de rutinas
                          </Title>
                          <Space size={2} />
                          {routinesHistory.map(({ date, routine }) => {
                            return (
                              <React.Fragment key={date}>
                                <Stats
                                  title={date}
                                  data={getStats(routine)}
                                  name={routine.name}
                                  startTime={routine.startTime}
                                  endTime={routine.endTime}
                                  uploadRoutineHandler={handleUploadRoutineHistoryClick(
                                    date,
                                    routine,
                                  )}
                                  deleteRoutineHandler={handleDeleteRoutineHistoryClick(date)}
                                />
                                <Space size={1} />
                              </React.Fragment>
                            );
                          })}
                        </Block>
                        <Space size={10} variant={Space.variant.DASHED} />
                      </React.Fragment>
                    ) : null}

                    <Title is="h2" size={Title.size.MD} className="tw-text-center">
                      Ajustes
                    </Title>
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
                  </Block>
                )}
              </Block>
            </TimerPageContext.Provider>
          ) : null;
        }}
      </Render>

      <style jsx>{`
        :global(body) {
          background-color: black;
        }
      `}</style>
    </Page>
  );
}

export default withAuth(TimerPage);

// --- Controller ---

function useController() {
  // hooks
  const { theme, setTheme } = useTheme();
  const {
    data: routinesTemplates,
    isLoading,
    error,
  } = useQuery(
    "timer",
    async () => {
      await delay(1000);

      try {
        const { data } = await http.post(
          `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`,
          {
            path: "/timer",
            method: "GET",
          },
        );

        return data;
      } catch (error) {
        const routinesTemplates = readRoutineFromLocalStorage()["TEMPLATES"];

        if (!routinesTemplates) {
          throw new Error("Routines templates not found in localStorage neither Firebase");
        } else {
          alert("Routines templates loaded from localStorage");
        }

        return routinesTemplates;
      }
    },
    {
      onSuccess: (routinesTemplates: T_Routine) => {
        saveRoutineInLocalStorage({ routine: routinesTemplates, date: "TEMPLATES" });

        const loadedRoutine = loadRoutine(createNewRoutine(routinesTemplates[0]));
        setCurrentRoutine(loadedRoutine);
        setRoutinesHistory(fetchRoutinesHistory());

        if (loadedRoutine.status !== ROUTINE_STATUS.COMPLETED) {
          findAndLoadRoutineItem(loadedRoutine);
        }
      },
    },
  );

  // states
  const [currentRoutine, setCurrentRoutine] = React.useState<T_Routine>();
  const [currentRoutineItem, setCurrentRoutineItem] = React.useState<T_RoutineItem>();
  const [currentRoutineItemIndex, setCurrentRoutineItemIndex] = React.useState<number>(0);
  const [timerStatus, setTimerStatus] = React.useState<T_TimerStatus>(TIMER_STATUS.NOT_STARTED);
  const [routinesHistory, setRoutinesHistory] = React.useState<
    { date: string; routine: T_Routine }[]
  >([]);

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

  const secondsToTime = React.useCallback(function secondsToTime(secondsParam: number): string {
    const seconds = Math.round(secondsParam);

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

  const calculateRoutineItemTotalTime = React.useCallback(
    function calculateRoutineItemTotalTime(
      sets: T_RoutineItem["sets"],
      highTime: T_RoutineItem["highTime"],
      restTime: T_RoutineItem["restTime"],
    ): number {
      return timeToSeconds(highTime) * sets + timeToSeconds(restTime) * (sets - 1);
    },
    [timeToSeconds],
  );

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

      setCurrentRoutine(routineUpdated);
      setCurrentRoutineItem(routineUpdated.items[routineItemFoundIndex]);
      setCurrentRoutineItemIndex(routineItemFoundIndex);
    } else {
      markRoutineAsCompleted(routine);
    }
  }

  function setRoutineItemAsStarted(routine: T_Routine, routineItemId: T_RoutineItem["id"]) {
    setScrollPosition(0);

    let routineUpdated = updateRoutineItemStatus(
      routine,
      routineItemId,
      ROUTINE_ITEMS_STATUS.IN_PROGRESS,
    );

    if (currentRoutineItem?.status === ROUTINE_ITEMS_STATUS.IN_PROGRESS) {
      routineUpdated = updateRoutineItemStatus(
        routineUpdated,
        currentRoutineItem?.id || "",
        ROUTINE_ITEMS_STATUS.NOT_STARTED,
      );
    }

    const routineItemFoundIndex = routineUpdated.items.findIndex(
      (item) => item.id === routineItemId,
    );

    setCurrentRoutine(routineUpdated);
    setCurrentRoutineItem(routineUpdated.items[routineItemFoundIndex]);
    setCurrentRoutineItemIndex(routineItemFoundIndex);
  }

  function markRoutineItemAsCompleted(currentRoutine, routineItemId, routineItemStatus, option) {
    const routineUpdated = updateRoutineItemStatus(
      currentRoutine,
      routineItemId,
      routineItemStatus === ROUTINE_ITEMS_STATUS.COMPLETED
        ? ROUTINE_ITEMS_STATUS.NOT_STARTED
        : ROUTINE_ITEMS_STATUS.COMPLETED,
    );
    setCurrentRoutine(routineUpdated);

    if (
      routineItemStatus === ROUTINE_ITEMS_STATUS.IN_PROGRESS &&
      option === "SEARCH_FOR_NEXT_ROUTINE_ITEM"
    ) {
      setScrollPosition(0);
      searchForNextNotStartedRoutineItem(routineUpdated);
    } else {
      setCurrentRoutineItem(routineUpdated.items[currentRoutineItemIndex]);
    }
  }

  // private
  const saveRoutineInLocalStorage = React.useCallback(function saveRoutineInLocalStorage({
    routine,
    date = createFormattedDate(),
  }: {
    routine?: T_Routine;
    date?: string;
  }) {
    const loadedRoutine = readRoutineFromLocalStorage();

    window.localStorage.setItem(
      "DFR_TIMER",
      JSON.stringify({
        ...loadedRoutine,
        [date]: routine,
      }),
    );
  },
  []);

  function loadRoutine(defaultRoutine: T_Routine, key?: string): T_Routine {
    const loadedRoutine =
      readRoutineFromLocalStorage()[key || createFormattedDate()] || defaultRoutine;

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
          remainingTime: "",
        };
      }

      const totalExercises = Object.keys(routine.items).length;
      const completedExercises = routine.items.filter((item) => {
        return item.status === ROUTINE_ITEMS_STATUS.COMPLETED;
      });
      const remainingItems = routine.items
        .filter((item) => item.status !== ROUTINE_ITEMS_STATUS.COMPLETED)
        .map((item) => {
          return calculateRoutineItemTotalTime(item.sets, item.highTime, item.restTime);
        });
      const isRoutineCompleted = completedExercises.length === totalExercises;

      return {
        totalExercises,
        totalCompletedExercises: completedExercises.length,
        completedPercent: `${Math.round((completedExercises.length / totalExercises) * 100)}%`,
        completedTime: secondsToTime(
          completedExercises.length > 0
            ? completedExercises
                .map((item) => {
                  return calculateRoutineItemTotalTime(item.sets, item.highTime, item.restTime);
                })
                .reduce((result, curr) => result + curr, 0) +
                timeToSeconds(routine.restTimeBetweenItems) *
                  (completedExercises.length - (isRoutineCompleted ? 1 : 0))
            : 0,
        ),
        totalTime: secondsToTime(
          routine.items
            .map((item) => {
              return calculateRoutineItemTotalTime(item.sets, item.highTime, item.restTime);
            })
            .reduce((result, curr) => result + curr, 0) +
            timeToSeconds(routine.restTimeBetweenItems) * (totalExercises - 1),
        ),
        finalRoutineDuration: routine.endTime
          ? secondsToTime(Math.ceil(Math.abs((routine.endTime.ms - routine.startTime.ms) / 1000)))
          : "",
        remainingTime: secondsToTime(
          remainingItems.reduce((result, curr) => result + curr, 0) +
            timeToSeconds(routine.restTimeBetweenItems) * (remainingItems.length - 1),
        ),
      };
    },
    [timeToSeconds, secondsToTime, calculateRoutineItemTotalTime],
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
    setCurrentRoutine(
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
    function markRoutineAsCompleted(routine?: T_Routine) {
      const routineUpdated = {
        ...routine,
        endTime: {
          ms: new Date().getTime(),
          formatted: new Date().toLocaleTimeString(),
        },
        status: ROUTINE_STATUS.COMPLETED,
      } as T_Routine;

      setTimerStatus(TIMER_STATUS.NOT_STARTED);
      setCurrentRoutine({ ...routineUpdated, stats: getStats(routineUpdated) });
      alert("La rutina ha sido completada!");
    },
    [getStats],
  );

  const setAtLeastOneRoutineItemAsInProgress = React.useCallback(
    function setAtLeastOneRoutineItemAsInProgress(routine: T_Routine) {
      const allRoutineItemsStatusIsNotStarted =
        routine.items.filter((item) => item.status === ROUTINE_ITEMS_STATUS.NOT_STARTED).length ===
        routine.items.length;

      if (allRoutineItemsStatusIsNotStarted) {
        const routineUpdated = updateRoutineItemStatus(
          routine,
          routine.items[0].id,
          ROUTINE_ITEMS_STATUS.IN_PROGRESS,
        );

        setCurrentRoutineItem(routineUpdated.items[0]);
        setCurrentRoutineItemIndex(0);
        setCurrentRoutine(routineUpdated);
      }
    },
    [updateRoutineItemStatus],
  );

  const fetchRoutinesHistory = React.useCallback(function fetchRoutinesHistory() {
    return Object.entries(readRoutineFromLocalStorage())
      .reduce((result, [date, routine]: [string, T_Routine]) => {
        if (routine.status !== ROUTINE_STATUS.COMPLETED) return result;

        return [...result, { date, routine }];
      }, [])
      .sort(sortBy([{ param: "date", order: "desc" }]));
  }, []);

  function createNewRoutine(routine: T_Routine): T_Routine {
    return {
      ...routine,
      status: ROUTINE_STATUS.NOT_STARTED,
      startTime: {
        ms: new Date().getTime(),
        formatted: new Date().toLocaleTimeString(),
      },

      items: (isDevelopmentEnvironment()
        ? (
            [
              {
                id: "tests",
                title: "tests",
                highTime: "00:03",
                sets: 2,
                restTime: "00:02",
                status: ROUTINE_ITEMS_STATUS.NOT_STARTED,
              },
            ] as T_RoutineItem[]
          ).concat(routine.items.slice(0, 3))
        : routine.items
      ).map((item) => {
        return { ...item, status: ROUTINE_ITEMS_STATUS.NOT_STARTED };
      }),
    };
  }

  function createFormattedDate() {
    const date = new Date();
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }

  // handlers
  function handleInitRoutineClick(routineTemplate: T_Routine) {
    return () => {
      const loadedRoutineFromLocalStorage = readRoutineFromLocalStorage()[createFormattedDate()];

      const thisRoutineWasCompletedPreviously =
        loadedRoutineFromLocalStorage?.status === ROUTINE_STATUS.COMPLETED;

      if (thisRoutineWasCompletedPreviously) {
        const userCanceledRoutineRestarting = !window.confirm(
          "Una rutina ya fue completada el día de hoy. ¿Está seguro que quiere iniciar una nueva rutina y sobre-escribir los datos de la rutina existente?",
        );

        if (userCanceledRoutineRestarting) return;

        const newRoutine = {
          ...createNewRoutine(routineTemplate),
          status: ROUTINE_STATUS.IN_PROGRESS,
        };
        setCurrentRoutine(newRoutine);
        findAndLoadRoutineItem(newRoutine);
      } else {
        setCurrentRoutine({
          ...createNewRoutine(routineTemplate),
          status: ROUTINE_STATUS.IN_PROGRESS,
        });
      }
    };
  }

  const handleCompleteRoutineClick = React.useCallback(
    function handleCompleteRoutineClick() {
      if (window.confirm("¿Está seguro que quiere completar la rutina? Hay items sin terminar")) {
        markRoutineAsCompleted(currentRoutine as T_Routine);
      }
    },
    [markRoutineAsCompleted, currentRoutine],
  );

  const handleCancelRoutineClick = React.useCallback(
    function handleCancelRoutineClick() {
      if (window.confirm("¿Está seguro que quiere cancelar la rutina?")) {
        saveRoutineInLocalStorage({ routine: undefined });
        setCurrentRoutine(createNewRoutine(routinesTemplates[0]));
        setTimerStatus(TIMER_STATUS.NOT_STARTED);
      }
    },
    [setCurrentRoutine, saveRoutineInLocalStorage, routinesTemplates],
  );

  const handleUploadRoutineHistoryClick = React.useCallback(
    function handleUploadRoutineHistoryClick(date, routine) {
      return async () => {
        try {
          await http.post(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
            path: "/timer",
            method: "POST",
            payload: {
              date,
              routine,
            },
          });
        } catch (error) {
          console.error(error);
          alert(error.message);
        }
      };
    },
    [],
  );

  const handleDeleteRoutineHistoryClick = React.useCallback(
    function handleDeleteRoutineHistoryClick(date) {
      return async () => {
        try {
          if (window.confirm("¿Está seguro?")) {
            saveRoutineInLocalStorage({ routine: undefined, date });
            setRoutinesHistory(fetchRoutinesHistory());
          }
        } catch (error) {
          console.error(error);
          alert(error.message);
        }
      };
    },
    [saveRoutineInLocalStorage, fetchRoutinesHistory],
  );

  // effects
  useDidMount(() => {
    if (theme === "dark") setTheme("light");
  });

  React.useEffect(
    function onRoutineChange() {
      if (!currentRoutine) return;

      saveRoutineInLocalStorage({ routine: currentRoutine });
      setRoutinesHistory(fetchRoutinesHistory());

      if (
        isRoutineCompleted(currentRoutine) &&
        currentRoutine.status !== ROUTINE_STATUS.COMPLETED
      ) {
        markRoutineAsCompleted(currentRoutine);
      } else {
        setAtLeastOneRoutineItemAsInProgress(currentRoutine);
      }
    },
    [
      currentRoutine,
      currentRoutineItem,
      currentRoutineItemIndex,
      timerStatus,

      markRoutineAsCompleted,
      saveRoutineInLocalStorage,
      updateRoutineItemStatus,
      setAtLeastOneRoutineItemAsInProgress,
      fetchRoutinesHistory,
    ],
  );

  return {
    // states
    currentRoutine,
    currentRoutineItem,
    currentRoutineItemIndex,
    timerStatus,
    routinesHistory,

    // states setters
    setTimerStatus,

    // handlers
    handleInitRoutineClick,
    handleCompleteRoutineClick,
    handleCancelRoutineClick,
    handleUploadRoutineHistoryClick,
    handleDeleteRoutineHistoryClick,

    // vars
    routinesTemplates,
    isLoading,
    error,

    // utils
    timeToSeconds,
    secondsToTime,
    getStats,
    markRoutineItemAsCompleted,
    calculateRoutineItemTotalTime,
    setRoutineItemAsStarted,
  };
}

// --- Components ---

function GoToHomeLink(): T_ReactElement {
  return (
    <Block className="tw-bg-black tw-text-white tw-p-1 tw-text-csenter tw-text-sm tw-font-bold tw-absolute tw-top-0 tw-w-full tw-h-8">
      <Button
        variant={Button.variant.SIMPLE}
        onClick={() => {
          if (window.confirm("¿Está seguro de que quiere ir al inicio?")) {
            window.location.href = ROUTES.HOME;
          }
        }}
      >
        <Icon icon={Icon.icon.CHEVRON_LEFT} color="tw-text-white" />
        <InlineText className="tw-align-middle tw-font-bold"> Volver al inicio</InlineText>
      </Button>
    </Block>
  );
}
