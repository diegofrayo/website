import * as React from "react";
import classNames from "classnames";

import { Block, Button, Icon, InlineText, Space, Text } from "~/components/primitive";
import type { T_ReactElement } from "~/types";
import { createArray } from "~/utils/misc";

import { ROUTINE_ITEMS_STATUS, TIMER_STATUS } from "../constants";
import { TimerPageContext } from "../context";
import type { T_RoutineItem } from "../types";

function Timer({
  routineItem,
  routineItemIndex,
}: {
  routineItem: T_RoutineItem;
  routineItemIndex: number;
}): T_ReactElement {
  // context
  const {
    // states
    currentRoutine,
    timerStatus,

    // states setters
    setTimerStatus,

    // utils
    secondsToTime,
    timeToSeconds,
    markRoutineItemAsCompleted,
    updateRoutineItem,
  } = React.useContext(TimerPageContext);

  // states
  const [timerInterval, setTimerInterval] = React.useState<NodeJS.Timeout | null>(null);
  const [time, setTime] = React.useState(0);
  const [sets, setSets] = React.useState<("START" | "REST" | "HIGH")[]>([]);
  const [currentSet, setCurrentSet] = React.useState({ index: 0, isRest: false, isStart: true });
  const [isSoundsMuted, setIsSoundsMuted] = React.useState(false);

  // utils
  const playSound = React.useCallback(
    function playSound(mode: "ROUTINE_ITEM_COMPLETED" | "SET_COMPLETED") {
      try {
        if (isSoundsMuted) return;

        (
          document.getElementById(
            mode === "ROUTINE_ITEM_COMPLETED"
              ? "audio-routine-item-completed"
              : "audio-set-completed",
          ) as HTMLAudioElement
        )?.play();
        window.navigator?.vibrate(200);
      } catch (error) {
        console.error(error);
      }
    },
    [isSoundsMuted],
  );

  const startTimer = React.useCallback(
    function startTimer() {
      setTimerInterval(
        setInterval(() => {
          setTime((currentValue) => currentValue - 1);
          setTimerStatus(TIMER_STATUS.RUNNING);

          console.log("Timer running");
        }, 1000),
      );
    },
    [setTimerStatus],
  );

  const stopTimer = React.useCallback(
    function stopTimer(timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
      setTimerStatus(TIMER_STATUS.PAUSED);

      console.log("Timer stopped");
    },
    [setTimerStatus],
  );

  const updateTime = React.useCallback(
    function updateTime(set, routineItem) {
      setTime(
        routineItem.status === ROUTINE_ITEMS_STATUS.COMPLETED
          ? 0
          : set.isStart
          ? 10
          : set.isRest
          ? timeToSeconds(routineItem.restTime)
          : timeToSeconds(routineItem.highTime),
      );
    },
    [setTime, timeToSeconds],
  );

  // effects
  React.useEffect(
    function getTimerReady() {
      const set = {
        index: routineItem.status === ROUTINE_ITEMS_STATUS.COMPLETED ? routineItem.sets * 2 - 2 : 0,
        isStart: routineItem.status !== ROUTINE_ITEMS_STATUS.COMPLETED,
        isRest: false,
      };

      updateTime(set, routineItem);
      setSets(
        createArray(routineItem.sets * 2, 0).map((index) => {
          if (index === 0) return "START";
          return index % 2 === 0 ? "REST" : "HIGH";
        }),
      );
      setCurrentSet(set);
      setTimerStatus(TIMER_STATUS.NOT_STARTED);
    },
    [routineItem, timeToSeconds, setTimerStatus, updateTime],
  );

  React.useEffect(
    function onTimeChange() {
      if (time === 0 && timerInterval) {
        stopTimer(timerInterval);

        const nextSet = {
          index: currentSet.index + 1,
          isStart: false,
          isRest: sets[currentSet.index + 1] === "REST",
        };
        const isLastSet = nextSet.index === sets.length;

        if (isLastSet) {
          playSound("ROUTINE_ITEM_COMPLETED");
          markRoutineItemAsCompleted(currentRoutine, routineItem.id, routineItem.status);
        } else {
          playSound("SET_COMPLETED");
          startTimer();
          updateTime(nextSet, routineItem);
          setCurrentSet(nextSet);
        }
      }
    },
    [
      time,
      sets,
      currentSet,
      timerInterval,
      startTimer,
      stopTimer,
      playSound,
      updateTime,

      routineItem,
      routineItemIndex,

      currentRoutine,
      setTimerStatus,
      timeToSeconds,
      markRoutineItemAsCompleted,
    ],
  );

  // handlers
  function handleStartRoutineItemClick() {
    if (timerInterval) {
      stopTimer(timerInterval);
    } else {
      startTimer();
    }
  }

  function handlePrevSetClick() {
    if (routineItem.status === ROUTINE_ITEMS_STATUS.COMPLETED) {
      const prevSet = {
        index: sets.length - 1,
        isStart: false,
        isRest: false,
      };

      updateRoutineItem(currentRoutine, routineItem.id, {
        status: ROUTINE_ITEMS_STATUS.IN_PROGRESS,
      });
      setCurrentSet(prevSet);
      setTime(timeToSeconds(routineItem.highTime));
    } else {
      const prevSet = {
        index: currentSet.index - 1,
        isStart: currentSet.index - 1 === 0,
        isRest: sets[currentSet.index - 1] === "REST",
      };

      setCurrentSet(prevSet);
      updateTime(prevSet, routineItem);
    }
  }

  function handleNextSetClick() {
    const nextSet = {
      index: currentSet.index + 1,
      isStart: false,
      isRest: sets[currentSet.index + 1] === "REST",
    };
    const isLastSet = nextSet.index === sets.length;

    if (isLastSet) {
      markRoutineItemAsCompleted(currentRoutine, routineItem.id, routineItem.status);
      stopTimer(timerInterval);
    } else {
      setCurrentSet(nextSet);
      updateTime(nextSet, routineItem);
    }
  }

  function handleResetCurrentSetClick() {
    updateTime(currentSet, routineItem);
  }

  // vars
  const isTimerRunning = timerInterval !== null;
  const isRoutineItemCompleted = routineItem.status === ROUTINE_ITEMS_STATUS.COMPLETED;
  const showNextSetButton = !isRoutineItemCompleted;
  const showPrevSetButton = currentSet.index > 0 || isRoutineItemCompleted;

  return (
    <Block
      className={classNames(
        "tw-text-white tw-text-center tw-py-8 tw-px-4",
        isRoutineItemCompleted
          ? "tw-bg-green-600"
          : currentSet.isStart
          ? "tw-bg-yellow-600"
          : currentSet.isRest
          ? "tw-bg-blue-600"
          : "tw-bg-red-600",
      )}
    >
      <audio
        src="/static/sounds/timer/set-completed.mp3"
        id="audio-set-completed"
        className="tw-hidden"
      />
      <audio
        src="/static/sounds/timer/routine-item-completed.mp3"
        id="audio-routine-item-completed"
        className="tw-hidden"
      />

      <Text className="tw-text-7xl">
        {secondsToTime(time)
          .split("")
          .map((char, index) => {
            return (
              <InlineText
                key={`char-${index}`}
                className={classNames("tw-inline-block", char !== ":" && "tw-w-12")}
              >
                {char}
              </InlineText>
            );
          })}
      </Text>
      <Space size={2} />

      {!isRoutineItemCompleted && (
        <React.Fragment>
          <Block className="tw-flex tw-justify-between tw-items-center">
            <Button
              variant={Button.variant.SIMPLE}
              className="tw-h-12 tw-w-12 tw-flex tw-items-center tw-justify-center"
              onClick={() => setIsSoundsMuted((currentValue) => !currentValue)}
            >
              <Icon
                icon={isSoundsMuted ? Icon.icon.VOLUME_OFF : Icon.icon.VOLUME_UP}
                size={24}
                color="tw-text-white"
              />
            </Button>
            <Button
              variant={Button.variant.SIMPLE}
              className="dfr-border-color-primary tw-rounded-full tw-h-32 tw-w-32 tw-border-4 tw-uppercase tw-font-bold"
              onClick={handleStartRoutineItemClick}
            >
              {timerStatus === TIMER_STATUS.NOT_STARTED
                ? "Iniciar"
                : isTimerRunning
                ? "Pausar"
                : "Reanudar"}
            </Button>
            <Button
              variant={Button.variant.SIMPLE}
              className="dfr-border-color-primary tw-rounded-full tw-h-12 tw-w-12 tw-border-2 tw-flex tw-items-center tw-justify-center"
              onClick={handleResetCurrentSetClick}
            >
              <Icon icon={Icon.icon.REPLY} color="tw-text-white" />
            </Button>
          </Block>
          <Space size={2} />
        </React.Fragment>
      )}

      <Block className="tw-text-sm">
        <Block className="tw-flex tw-justify-between tw-items-center">
          <Button
            variant={Button.variant.SIMPLE}
            className={classNames("tw-mr-auto", showPrevSetButton ? "tw-visible" : "tw-invisible")}
            onClick={handlePrevSetClick}
          >
            <Icon icon={Icon.icon.CHEVRON_LEFT} color="tw-text-white" size={24} />
          </Button>
          <Block className="tw-flex-1">
            <Text className="tw-font-bold">
              {isRoutineItemCompleted
                ? "Completado"
                : currentSet.isStart
                ? "Iniciando..."
                : currentSet.isRest
                ? "Descanso"
                : "Acción"}
            </Text>
            <Text>{routineItem.title}</Text>
          </Block>
          <Button
            variant={Button.variant.SIMPLE}
            className={classNames("tw-ml-auto", showNextSetButton ? "tw-visible" : "tw-invisible")}
            onClick={handleNextSetClick}
          >
            <Icon icon={Icon.icon.CHEVRON_RIGHT} color="tw-text-white" size={24} />
          </Button>
        </Block>
        <Space size={2} />
        <Text className="tw-text-center tw-mt-3">
          {currentSet.isStart
            ? 0
            : routineItem.status === ROUTINE_ITEMS_STATUS.COMPLETED
            ? routineItem.sets
            : Math[currentSet.isRest ? "ceil" : "round"](currentSet.index / 2)}
          /{routineItem.sets}
        </Text>
      </Block>
    </Block>
  );
}

export default Timer;