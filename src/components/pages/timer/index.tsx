import * as React from "react";
import classNames from "classnames";
import { useTheme } from "next-themes";

import { Page } from "~/components/layout";
import {
  Block,
  Button,
  Collapsible,
  Icon,
  InlineText,
  Link,
  Space,
  Text,
  Title,
} from "~/components/primitive";
import { withAuth } from "~/auth";
import { useDidMount } from "~/hooks";
import type { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";
import { createArray } from "~/utils/misc";
import { setScrollPosition } from "~/utils/browser";

function TimerPage(): T_ReactElement {
  const {
    // states
    routine,
    currentRoutineItem,

    // vars
    stats,

    // utils
    updateRoutineItemStatus,
    setRoutineItemAsStarted,
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
      <PageContext.Provider
        value={{
          updateRoutineItemStatus,
          setRoutineItemAsStarted,
          timeToSeconds,
          secondsToTime,
          fillNumber,
        }}
      >
        <Block className="dfr-shadow tw-max-w-sm tw-mx-auto">
          <GoToHomeLink />

          {currentRoutineItem && <Timer item={currentRoutineItem} />}

          <Block className="tw-p-2">
            <Stats data={stats} />
            <Space size={1} />
            <Block>
              {routine.items.map((item) => {
                return <RoutineItem key={item.id} item={item} />;
              })}
            </Block>
          </Block>
        </Block>
      </PageContext.Provider>
    </Page>
  );
}

export default withAuth(TimerPage);

// --- Context ---

const PageContext = React.createContext({
  timeToSeconds: (number) => number,
  secondsToTime: (number) => number,
  fillNumber: (number) => number,
  updateRoutineItemStatus: (number, status) => (): void => {
    console.log(number, status);
  },
  setRoutineItemAsStarted: (number) => (): void => {
    console.log(number);
  },
});

const ROUTINE_ITEMS_STATUS = {
  IN_PROGRESS: "en progreso",
  NO_STARTED: "sin iniciar",
  FINISHED: "completado",
};

// --- Controller ---

function useController() {
  // hooks
  const { theme, setTheme } = useTheme();

  // states
  const [routine, setRoutine] = React.useState<T_Routine>({
    restTimeBetweenItems: "01:00",
    startTime: "",
    endTime: "",
    items: [
      {
        id: "calentamiento",
        title: "Calentamiento",
        highTime: "12:00",
        sets: 1,
        status: ROUTINE_ITEMS_STATUS.NO_STARTED,
      },
      {
        id: "tests",
        title: "tests",
        highTime: "00:03",
        sets: 3,
        restTime: "00:02",
        status: ROUTINE_ITEMS_STATUS.NO_STARTED,
      },
      {
        id: "pelota",
        title: "Pelota",
        highTime: "02:00",
        sets: 3,
        restTime: "01:00",
        status: ROUTINE_ITEMS_STATUS.NO_STARTED,
      },
      {
        id: "abdominales",
        title: "Abdominales",
        highTime: "00:50",
        sets: 5,
        restTime: "00:30",
        status: ROUTINE_ITEMS_STATUS.NO_STARTED,
      },
      {
        id: "lumbares",
        title: "Lumbares",
        highTime: "00:50",
        sets: 2,
        restTime: "00:30",
        status: ROUTINE_ITEMS_STATUS.NO_STARTED,
      },
      {
        id: "flexiones",
        title: "Flexiones",
        highTime: "00:50",
        sets: 2,
        restTime: "00:30",
        status: ROUTINE_ITEMS_STATUS.NO_STARTED,
      },
      {
        id: "sentadillas",
        title: "Sentadillas",
        highTime: "00:50",
        sets: 2,
        restTime: "00:30",
        status: ROUTINE_ITEMS_STATUS.NO_STARTED,
      },
      {
        id: "fortalecimiento-1",
        title: "Fortalecimiento 1",
        highTime: "01:10",
        sets: 3,
        restTime: "00:30",
        status: ROUTINE_ITEMS_STATUS.NO_STARTED,
      },
      {
        id: "fortalecimiento-2",
        title: "Fortalecimiento 2",
        highTime: "00:35",
        sets: 3,
        restTime: "00:35",
        status: ROUTINE_ITEMS_STATUS.NO_STARTED,
      },
      {
        id: "fondos",
        title: "Fondos",
        highTime: "01:00",
        sets: 3,
        restTime: "00:30",
        status: ROUTINE_ITEMS_STATUS.NO_STARTED,
      },
      {
        id: "pecho",
        title: "Pecho",
        highTime: "02:00",
        sets: 3,
        restTime: "01:00",
        status: ROUTINE_ITEMS_STATUS.NO_STARTED,
      },
      {
        id: "brazo",
        title: "Brazo",
        highTime: "02:00",
        sets: 3,
        restTime: "01:00",
        status: ROUTINE_ITEMS_STATUS.NO_STARTED,
      },
      {
        id: "5",
        title: "Yoga",
        highTime: "15:00",
        sets: 1,
        status: ROUTINE_ITEMS_STATUS.NO_STARTED,
      },
    ],
  });
  const [currentRoutineItem, setCurrentItem] = React.useState<T_RoutineItem | null>(null);

  // utils
  function updateRoutineItemStatus(itemId, status) {
    return () => {
      setRoutine({
        ...routine,
        items: routine.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              status,
            };
          }

          return {
            ...item,
            status:
              item.status === ROUTINE_ITEMS_STATUS.IN_PROGRESS
                ? ROUTINE_ITEMS_STATUS.NO_STARTED
                : item.status,
          };
        }),
      });
    };
  }

  function setRoutineItemAsStarted(itemId) {
    return () => {
      const selectedItem = routine.items.find((item) => item.id === itemId);

      if (selectedItem) {
        setCurrentItem(selectedItem);
        setScrollPosition(0);
      } else {
        alert("Error");
      }
    };
  }

  function timeToSeconds(time) {
    if (!time || time.split(":").length === 0) return 0;

    const [hours, minutes, seconds] = time.split(":").map(Number);

    if (minutes === undefined && seconds === undefined) {
      return hours;
    }

    if (seconds === undefined) {
      return hours * 60 + minutes;
    }

    return hours * 60 * 60 + minutes * 60 + seconds + seconds;
  }

  function secondsToTime(seconds) {
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

  function fillNumber(number) {
    return `${number < 10 ? "0" : ""}${number}`;
  }

  // private
  const saveRoutineInLocalStorage = React.useCallback(
    function saveRoutineInLocalStorage() {
      const loadedRoutine = readRoutineFromLocalStorage();

      window.localStorage.setItem(
        "DFR_TIMER",
        JSON.stringify({
          ...loadedRoutine,
          [new Date().toLocaleDateString()]: routine,
        }),
      );
    },
    [routine],
  );

  function loadRoutineFromLocalStorage() {
    const loadedRoutine = readRoutineFromLocalStorage()[new Date().toLocaleDateString()];

    if (loadedRoutine) setRoutine(loadedRoutine);
  }

  function readRoutineFromLocalStorage() {
    try {
      return JSON.parse((window.localStorage.getItem("DFR_TIMER") || "") as string);
    } catch (error) {
      console.error(error);
      return {};
    }
  }

  function getStats(routine: T_Routine) {
    const totalExercises = Object.keys(routine.items).length;
    const completedExercises = routine.items.filter((item) => {
      return item.status === ROUTINE_ITEMS_STATUS.FINISHED;
    });

    return {
      totalExercises,
      completedPercent: `${Math.round((completedExercises.length / totalExercises) * 100)}%`,
      completedTime: secondsToTime(
        completedExercises
          .map((item) => {
            return (
              timeToSeconds(item.highTime) * item.sets +
              timeToSeconds(item.restTime) * (item.sets - 1)
            );
          })
          .reduce((result, curr) => result + curr, 0) +
          timeToSeconds(routine.restTimeBetweenItems) * (completedExercises.length - 1),
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

  // effects
  useDidMount(() => {
    if (theme === "dark") setTheme("light");

    loadRoutineFromLocalStorage();
  });

  React.useEffect(
    function updateRoutineInLocalStorage() {
      saveRoutineInLocalStorage();

      const itemInProgress = routine.items.find(
        (item) => item.status === ROUTINE_ITEMS_STATUS.IN_PROGRESS,
      );

      if (itemInProgress) {
        setCurrentItem(itemInProgress);
      } else {
        const itemNoStarted = routine.items.find(
          (item) => item.status === ROUTINE_ITEMS_STATUS.NO_STARTED,
        );

        if (itemNoStarted) setCurrentItem(itemNoStarted);
      }
    },
    [routine, saveRoutineInLocalStorage],
  );

  return {
    // states
    routine,
    currentRoutineItem,

    // vars
    stats: getStats(routine),

    // utils
    updateRoutineItemStatus,
    setRoutineItemAsStarted,
    timeToSeconds,
    secondsToTime,
    fillNumber,
  };
}

// --- Components ---

function GoToHomeLink() {
  return (
    <Block className="tw-bg-black tw-text-white tw-p-1 tw-text-csenter tw-text-sm tw-font-bold">
      <Link variant={Link.variant.SIMPLE} href={ROUTES.HOME}>
        <Icon icon={Icon.icon.CHEVRON_LEFT} color="tw-text-white" />
        <InlineText className="tw-align-middle"> Volver al inicio</InlineText>
      </Link>
    </Block>
  );
}

function Timer({ item }: { item: T_RoutineItem }) {
  // context
  const { timeToSeconds, secondsToTime, updateRoutineItemStatus } = React.useContext(PageContext);

  // states
  const [timerInterval, setTimerInterval] = React.useState<NodeJS.Timeout | null>(null);
  const [time, setTime] = React.useState(0);
  const [sets, setSets] = React.useState<number[]>([]);
  const [currentSet, setCurrentSet] = React.useState({ index: 0, isRest: false });

  // effects
  React.useEffect(
    function createSets() {
      setSets(createArray(item.sets * 2 - 1).map((index) => (index % 2 == 1 ? 1 : 0)));
      setTime(timeToSeconds(item.highTime));
      setCurrentSet({ index: 0, isRest: false });
    },
    [item, timeToSeconds],
  );

  React.useEffect(
    function stopTimer() {
      if (time === 0 && timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
        console.log("Interval stopped");
        playRing();

        const nextSet = { index: currentSet.index + 1, isRest: sets[currentSet.index + 1] === 0 };

        if (nextSet.index < sets.length) {
          setCurrentSet(nextSet);

          if (nextSet.isRest) {
            setTime(timeToSeconds(item.restTime));
          } else {
            setTime(timeToSeconds(item.highTime));
          }

          setTimerInterval(
            setInterval(() => {
              console.log("Interval running");
              setTime((currentValue) => currentValue - 1);
            }, 1000),
          );
        } else {
          updateRoutineItemStatus(item.id, ROUTINE_ITEMS_STATUS.FINISHED)();
        }
      }
    },
    [time, timerInterval, currentSet, sets, item, updateRoutineItemStatus],
  );

  // utils
  const handleStartClick = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
      console.log("Interval stopped");
    } else {
      setTimerInterval(
        setInterval(() => {
          console.log("Interval running");
          setTime((currentValue) => currentValue - 1);
        }, 1000),
      );

      if (item.status !== ROUTINE_ITEMS_STATUS.IN_PROGRESS) {
        updateRoutineItemStatus(item.id, ROUTINE_ITEMS_STATUS.IN_PROGRESS)();
      }
    }
  };

  function playRing() {
    new Audio("/static/sounds/timer.mp3").play();
    window.navigator.vibrate(200);
  }

  const isTimerRunning = timerInterval !== null;
  const isItemCompleted =
    currentSet.index === sets.length - 1 && !isTimerRunning && item.status === "completed";

  return (
    <Block
      className={classNames(
        "tw-text-white tw-text-center tw-py-6 tw-px-4",
        isItemCompleted
          ? "tw-bg-green-600"
          : currentSet.isRest
          ? "tw-bg-blue-600"
          : "tw-bg-red-600",
      )}
    >
      <Text className="tw-text-8xl">{secondsToTime(time)}</Text>
      <Space size={2} />

      {!isItemCompleted && (
        <Button
          variant={Button.variant.SIMPLE}
          onClick={handleStartClick}
          className="dfr-border-color-primary tw-rounded-full tw-h-32 tw-w-32 tw-border-2"
        >
          {isTimerRunning ? "Pausar" : "Reanudar"}
        </Button>
      )}
      <Space size={2} />

      <Block className="tw-flex tw-justify-between tw-items-center tw-w-full">
        <Button variant={Button.variant.SIMPLE}>
          <Icon icon={Icon.icon.CHEVRON_LEFT} color="tw-text-white" size={24} />
        </Button>
        <Block className="tw-flex-1 tw-text-sm">
          <Text className="tw-font-bold">{currentSet.isRest ? "Descanso" : "Ejercicio"}</Text>
          <Text>
            {item.title} - {currentSet.index + 1}/{sets.length}
          </Text>
        </Block>
        <Button variant={Button.variant.SIMPLE}>
          <Icon icon={Icon.icon.CHEVRON_RIGHT} color="tw-text-white" size={24} />
        </Button>
      </Block>
    </Block>
  );
}

function Stats({
  data,
}: {
  data: {
    totalExercises: number;
    completedPercent: string;
    completedTime: string;
    totalTime: string;
  };
}) {
  return (
    <Collapsible title="Estadísticas" className="tw-border tw-rounded-md tw-px-3 tw-pt-2 tw-pb-3">
      <Block is="section" className="">
        <Block className="tw-text-sm">
          <Block className="tw-flex tw-justify-between">
            <InlineText is="strong">total ejercicios:</InlineText>
            <InlineText>{data.totalExercises}</InlineText>
          </Block>
          <Block className="tw-flex tw-justify-between">
            <InlineText is="strong">% completado:</InlineText>
            <InlineText>{data.completedPercent}</InlineText>
          </Block>
          <Block className="tw-flex tw-justify-between">
            <InlineText is="strong">tiempo completado:</InlineText>
            <InlineText>{data.completedTime}</InlineText>
          </Block>
          <Block className="tw-flex tw-justify-between">
            <InlineText is="strong">tiempo total:</InlineText>
            <InlineText>{data.totalTime}</InlineText>
          </Block>
        </Block>
      </Block>
    </Collapsible>
  );
}

function RoutineItem({
  item: { id, status, title, sets = 1, highTime, restTime },
}: {
  item: T_RoutineItem;
}) {
  const { setRoutineItemAsStarted, updateRoutineItemStatus } = React.useContext(PageContext);

  return (
    <Block
      is="article"
      className={classNames("dfr-RoutineItem dfr-shadow tw-mb-3 tw-border last:tw-mb-0", {
        "tw-bg-gray-100 tw-border-gray-200": status === ROUTINE_ITEMS_STATUS.NO_STARTED,
        "tw-bg-yellow-100 tw-border-yellow-200": status === ROUTINE_ITEMS_STATUS.IN_PROGRESS,
        "tw-bg-green-100 tw-border-green-200": status === ROUTINE_ITEMS_STATUS.FINISHED,
      })}
    >
      <Block
        is="header"
        className={classNames(
          "tw-flex tw-justify-between tw-items-center tw-px-3 tw-py-2 tw-border-b tw-border-dasshed",
          {
            "tw-border-gray-200": status === ROUTINE_ITEMS_STATUS.NO_STARTED,
            "tw-border-yellow-200": status === ROUTINE_ITEMS_STATUS.IN_PROGRESS,
            "tw-border-green-200": status === ROUTINE_ITEMS_STATUS.FINISHED,
          },
        )}
      >
        <Title is="h1" variant={Title.variant.SECONDARY} size={Title.size.MD}>
          {title}
        </Title>
        <Text className="tw-text-xs tw-font-bold tw-italic">{`${sets} ${
          sets === 1 ? "repetición" : "repeticiones"
        }`}</Text>
      </Block>
      <Block className="tw-px-3 tw-py-3">
        <Block className="tw-flex tw-justify-between tw-items-center">
          <InlineText className="tw-text-sm">Tiempo de ejecución</InlineText>
          <InlineText className="tw-bg-red-600 tw-text-white tw-py-1 tw-px-2 tw-rounded-lg tw-text-xs tw-font-bold tw-w-14 tw-text-center">
            {highTime}
          </InlineText>
        </Block>
        {restTime && (
          <React.Fragment>
            <Space size={0.5} />
            <Block className="tw-flex tw-justify-between tw-items-center">
              <InlineText className="tw-text-sm">Tiempo de descanso</InlineText>
              <InlineText className="tw-bg-green-600 tw-text-white tw-py-1 tw-px-2 tw-rounded-lg tw-text-xs tw-font-bold tw-w-14 tw-text-center">
                {restTime}
              </InlineText>
            </Block>
          </React.Fragment>
        )}
        <Space size={1} />
        <Block className="tw-flex tw-items-center tw-justify-between">
          {status === ROUTINE_ITEMS_STATUS.NO_STARTED && (
            <Button variant={Button.variant.SIMPLE} onClick={setRoutineItemAsStarted(id)}>
              <Icon icon={Icon.icon.PLAY} size={12} />
              <InlineText className="tw-ml-1 tw-text-xxs tw-align-middle">iniciar</InlineText>
            </Button>
          )}

          <Button
            variant={Button.variant.SIMPLE}
            className="tw-ml-auto"
            onClick={updateRoutineItemStatus(
              id,
              status === ROUTINE_ITEMS_STATUS.FINISHED
                ? ROUTINE_ITEMS_STATUS.NO_STARTED
                : ROUTINE_ITEMS_STATUS.FINISHED,
            )}
          >
            <Icon icon={Icon.icon.CHECK} size={12} />
            <InlineText className="tw-ml-1 tw-text-xxs tw-align-middle">
              marcar como{" "}
              {status === ROUTINE_ITEMS_STATUS.FINISHED
                ? ROUTINE_ITEMS_STATUS.NO_STARTED
                : ROUTINE_ITEMS_STATUS.FINISHED}
            </InlineText>
          </Button>
        </Block>
      </Block>
    </Block>
  );
}

// --- Types ---

type T_Routine = {
  startTime: string;
  endTime: string;
  restTimeBetweenItems: string;
  items: T_RoutineItem[];
};

type T_RoutineItem = {
  id: string;
  title: string;
  highTime: string;
  sets: number;
  restTime?: string;
  status: string;
};
