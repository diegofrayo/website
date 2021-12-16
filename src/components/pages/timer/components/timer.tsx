import * as React from "react";
import classNames from "classnames";

import { Block, Button, Icon, InlineText, Space, Text } from "~/components/primitive";
import type { T_ReactElement } from "~/types";
import { createArray } from "~/utils/misc";

import { ROUTINE_ITEMS_STATUS, TIMER_STATUS } from "../constants";
import { TimerPageContext } from "../context";
import type { T_RoutineItem } from "../types";

function Timer({ routineItem }: { routineItem: T_RoutineItem }): T_ReactElement {
  // context
  const {
    // states
    timerStatus,

    // states setters
    setTimerStatus,

    // utils
    timeToSeconds,
    secondsToTime,
  } = React.useContext(TimerPageContext);

  // states
  const [timerInterval, setTimerInterval] = React.useState<NodeJS.Timeout | null>(null);
  const [time, setTime] = React.useState(0);
  const [sets, setSets] = React.useState<("REST" | "HIGH")[]>([]);
  const [currentSet, setCurrentSet] = React.useState({ index: 0, isRest: false });

  // utils
  const startTimer = React.useCallback(function startTimer() {
    setTimerInterval(
      setInterval(() => {
        setTime((currentValue) => currentValue - 1);

        console.log("Timer running");
      }, 1000),
    );
  }, []);

  const stopTimer = React.useCallback(function stopTimer(
    timerInterval,
    mode: "SET_PAUSED" | "SET_COMPLETED",
  ) {
    clearInterval(timerInterval);
    setTimerInterval(null);
    if (mode === "SET_COMPLETED") playSound();

    console.log("Timer stopped");
  },
  []);

  function playSound() {
    try {
      (document.getElementById("audio") as HTMLAudioElement)?.play();
      window.navigator.vibrate(200);
    } catch (error) {
      console.error(error);
    }
  }

  // effects
  React.useEffect(
    function getTimerReady() {
      setSets(
        createArray(routineItem.sets * 2 - 1).map((index) => (index % 2 == 0 ? "REST" : "HIGH")),
      );
      setTime(timeToSeconds(routineItem.highTime));
      setCurrentSet({ index: 0, isRest: false });
    },
    [routineItem, timeToSeconds],
  );

  // React.useEffect(
  //   function updateTimerState() {
  //     if (timerStatus === "STOPPED") {
  //       stopTimer(timerInterval, "COMPLETED");
  //     }
  //   },
  //   [timerStatus, timerInterval, stopTimer],
  // );

  // React.useEffect(
  //   function onTimeChange() {
  //     if (time === 0 && timerInterval) {
  //       stopTimer(timerInterval, "COMPLETED");

  //       const nextSet = {
  //         index: currentSet.index + 1,
  //         isRest: sets[currentSet.index + 1] === "rest",
  //       };

  //       const isLastSet = nextSet.index === sets.length;

  //       if (isLastSet) {
  //         updateRoutineItemStatus(routineItem.id, ROUTINE_ITEMS_STATUS.COMPLETED);
  //       } else {
  //         setCurrentSet(nextSet);
  //         setTime(
  //           nextSet.isRest
  //             ? timeToSeconds(routineItem.restTime)
  //             : timeToSeconds(routineItem.highTime),
  //         );
  //         startTimer();
  //       }
  //     }
  //   },
  //   [
  //     currentSet,
  //     routineItem,
  //     sets,
  //     startTimer,
  //     stopTimer,
  //     time,
  //     timeToSeconds,
  //     timerInterval,
  //     updateRoutineItemStatus,
  //   ],
  // );

  // handlers
  function handleStartRoutineItemClick() {
    if (timerInterval) {
      stopTimer(timerInterval, "SET_PAUSED");
      setTimerStatus(TIMER_STATUS.PAUSED);
    } else {
      startTimer();
      setTimerStatus(TIMER_STATUS.RUNNING);
    }
  }

  function handlePrevSetClick() {
    if (currentSet.index === 0) return;

    const prevSet = {
      index: currentSet.index - 1,
      isRest: sets[currentSet.index - 1] === "REST",
    };

    setCurrentSet(prevSet);
    setTime(
      prevSet.isRest ? timeToSeconds(routineItem.restTime) : timeToSeconds(routineItem.highTime),
    );
    startTimer();
  }

  function handleNextSetClick() {
    const isNotLastSet = currentSet.index < sets.length - 1;

    if (isNotLastSet) {
      const nextSet = {
        index: currentSet.index + 1,
        isRest: sets[currentSet.index + 1] === "REST",
      };

      setCurrentSet(nextSet);
      setTime(
        nextSet.isRest ? timeToSeconds(routineItem.restTime) : timeToSeconds(routineItem.highTime),
      );

      return;
    }

    // findNextRoutineItemToStart();
  }

  // utils
  function checkHasToShowNextButton() {
    return true;
  }

  // vars
  const isTimerRunning = timerInterval !== null;
  const isRoutineItemCompleted =
    currentSet.index === sets.length - 1 &&
    !isTimerRunning &&
    routineItem.status === ROUTINE_ITEMS_STATUS.COMPLETED;
  const showNextSetButton = checkHasToShowNextButton();

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
      <audio src="/static/sounds/timer.mp3" id="audio" className="tw-hidden" />

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

      <Button
        variant={Button.variant.SIMPLE}
        onClick={handleStartRoutineItemClick}
        className="dfr-border-color-primary tw-rounded-full tw-h-32 tw-w-32 tw-border-2"
      >
        {timerStatus === TIMER_STATUS.NOT_STARTED
          ? "Iniciar"
          : isTimerRunning
          ? "Pausar"
          : "Reanudar"}
      </Button>
      <Space size={2} />

      <Block className="tw-flex tw-justify-between tw-items-center tw-w-full">
        <Button
          variant={Button.variant.SIMPLE}
          className={classNames("tw-mr-auto", currentSet.index > 0 ? "tw-visible" : "tw-invisible")}
          onClick={handlePrevSetClick}
        >
          <Icon icon={Icon.icon.CHEVRON_LEFT} color="tw-text-white" size={24} />
        </Button>
        <Block className="tw-flex-1 tw-text-sm">
          <Text className="tw-font-bold">{currentSet.isRest ? "Descanso" : "Ejercicio"}</Text>
          <Text>
            {routineItem.title} - {currentSet.index + 1}/{sets.length}
          </Text>
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
    </Block>
  );
}

export default Timer;
