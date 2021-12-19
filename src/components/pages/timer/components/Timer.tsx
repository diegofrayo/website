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
    routine,
    timerStatus,

    // states setters
    setRoutine,
    setTimerStatus,
    setCurrentRoutineItem,

    // utils
    secondsToTime,
    timeToSeconds,
    updateRoutineItemStatus,
  } = React.useContext(TimerPageContext);

  // states
  const [timerInterval, setTimerInterval] = React.useState<NodeJS.Timeout | null>(null);
  const [time, setTime] = React.useState(0);
  const [sets, setSets] = React.useState<("REST" | "HIGH")[]>([]);
  const [currentSet, setCurrentSet] = React.useState({ index: 0, isRest: false });

  // utils
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
    function stopTimer(timerInterval, mode: "SET_PAUSED" | "SET_COMPLETED") {
      clearInterval(timerInterval);
      setTimerInterval(null);
      setTimerStatus(TIMER_STATUS.PAUSED);
      if (mode === "SET_COMPLETED") playSound("COMPLETED");

      console.log("Timer stopped");
    },
    [setTimerStatus],
  );

  function playSound(mode: "RUNNING" | "COMPLETED") {
    try {
      (
        document.getElementById(
          mode === "RUNNING" ? "audio-running" : "audio-completed",
        ) as HTMLAudioElement
      )?.play();
      window.navigator?.vibrate(200);
    } catch (error) {
      console.error(error);
    }
  }

  // effects
  React.useEffect(
    function getTimerReady() {
      setTime(timeToSeconds(routineItem.highTime));
      setSets(
        createArray(routineItem.sets * 2 - 1).map((index) => (index % 2 == 0 ? "REST" : "HIGH")),
      );
      setCurrentSet({
        index: routineItem.status === ROUTINE_ITEMS_STATUS.COMPLETED ? routineItem.sets * 2 - 2 : 0,
        isRest: false,
      });
      setTimerStatus(TIMER_STATUS.NOT_STARTED);
    },
    [routineItem, timeToSeconds, setTimerStatus],
  );

  React.useEffect(
    function onTimeChange() {
      if (time === 0 && timerInterval) {
        stopTimer(timerInterval, "SET_COMPLETED");

        const nextSet = {
          index: currentSet.index + 1,
          isRest: sets[currentSet.index + 1] === "REST",
        };
        const isLastSet = nextSet.index === sets.length;

        if (isLastSet) {
          const routineUpdated = updateRoutineItemStatus(
            routine,
            routineItem.id,
            ROUTINE_ITEMS_STATUS.COMPLETED,
          );

          setRoutine(routineUpdated);
          setCurrentRoutineItem(routineUpdated.items[routineItemIndex]);
        } else {
          startTimer();
          setTime(
            nextSet.isRest
              ? timeToSeconds(routineItem.restTime)
              : timeToSeconds(routineItem.highTime),
          );
          setCurrentSet(nextSet);
        }
      }
    },
    [
      routineItem,
      routineItemIndex,
      time,
      sets,
      currentSet,
      startTimer,
      stopTimer,

      routine,
      setRoutine,
      setCurrentRoutineItem,
      setTimerStatus,

      timeToSeconds,
      timerInterval,
      updateRoutineItemStatus,
    ],
  );

  // handlers
  function handleStartRoutineItemClick() {
    if (timerInterval) {
      stopTimer(timerInterval, "SET_PAUSED");
    } else {
      startTimer();
    }
  }

  function handlePrevSetClick() {
    const prevSet = {
      index: currentSet.index - 1,
      isRest: sets[currentSet.index - 1] === "REST",
    };

    setCurrentSet(prevSet);
    setTime(
      prevSet.isRest ? timeToSeconds(routineItem.restTime) : timeToSeconds(routineItem.highTime),
    );
  }

  function handleNextSetClick() {
    const nextSet = {
      index: currentSet.index + 1,
      isRest: sets[currentSet.index + 1] === "REST",
    };

    setCurrentSet(nextSet);
    setTime(
      nextSet.isRest ? timeToSeconds(routineItem.restTime) : timeToSeconds(routineItem.highTime),
    );
  }

  function handleResetCurrentSetClick() {
    setTime(
      currentSet.isRest ? timeToSeconds(routineItem.restTime) : timeToSeconds(routineItem.highTime),
    );
  }

  // vars
  const isTimerRunning = timerInterval !== null;
  const isRoutineItemCompleted = routineItem.status === ROUTINE_ITEMS_STATUS.COMPLETED;
  const showNextSetButton = !isRoutineItemCompleted && currentSet.index < sets.length - 1;
  const showPrevSetButton = !isRoutineItemCompleted && currentSet.index > 0;

  return (
    <Block
      className={classNames(
        "tw-text-white tw-text-center tw-py-6 tw-px-4",
        isRoutineItemCompleted
          ? "tw-bg-green-600"
          : currentSet.isRest
          ? "tw-bg-blue-600"
          : "tw-bg-red-600",
      )}
    >
      <audio
        src="/static/sounds/timer/set-completed.mp3"
        id="audio-completed"
        className="tw-hidden"
      />
      <audio src="/static/sounds/timer/single-tick.mp3" id="audio-running" className="tw-hidden" />

      <Text className="tw-text-8xl">
        {secondsToTime(time)
          .split("")
          .map((char, index) => {
            return (
              <InlineText
                key={`char-${index}`}
                className={classNames("tw-inline-block", char !== ":" && "tw-w-14")}
              >
                {char}
              </InlineText>
            );
          })}
      </Text>
      <Space size={2} />

      {!isRoutineItemCompleted && (
        <React.Fragment>
          <Block className="tw-relative tw-text-center">
            <Button
              variant={Button.variant.SIMPLE}
              onClick={handleStartRoutineItemClick}
              className="dfr-border-color-primary tw-rounded-full tw-h-32 tw-w-32 tw-border-4 tw-uppercase tw-font-bold"
            >
              {timerStatus === TIMER_STATUS.NOT_STARTED
                ? "Iniciar"
                : isTimerRunning
                ? "Pausar"
                : "Reanudar"}
            </Button>
            <Button
              variant={Button.variant.SIMPLE}
              onClick={handleResetCurrentSetClick}
              className="dfr-border-color-primary tw-rounded-full tw-h-12 tw-w-12 tw-border-2 tw-right-2 tw-absolute tw-top-10"
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
              {isRoutineItemCompleted ? "Completado" : currentSet.isRest ? "Descanso" : "Acción"}
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
        <Text className="tw-text-center tw-mt-3">
          {Math[currentSet.isRest ? "ceil" : "round"]((currentSet.index + 1) / 2)}/
          {routineItem.sets}
        </Text>
      </Block>
      <Space size={2} />
    </Block>
  );
}

export default Timer;
