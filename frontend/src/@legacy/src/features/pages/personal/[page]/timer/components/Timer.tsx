// @ts-nocheck

import * as React from "react";
import classNames from "classnames";

import { Block, Button, Icon, InlineText, Space, Text } from "~/@legacy/src/components/primitive";
import { createArray } from "~/@legacy/src/utils/objects-and-arrays";
import type { T_ReactElement, T_SetTimeout } from "~/@legacy/src/types";

import { ROUTINE_ITEMS_STATUS, TIMER_STATUS } from "../constants";
import { TimerPageContext } from "../context";
import type { T_RoutineItem } from "../types";

function Timer({
	routineItem,
	routineItemIndex,
	routineItemsStartTime,
}: {
	routineItem: T_RoutineItem;
	routineItemIndex: number;
	routineItemsStartTime: number;
}): T_ReactElement {
	// context
	const {
		// states
		currentRoutine,
		timerStatus,
		isUILocked,

		// states setters
		setTimerStatus,
		setIsUILocked,

		// utils
		secondsToTime,
		timeToSeconds,
		markRoutineItemAsCompleted,
		updateRoutineItem,
	} = React.useContext(TimerPageContext);

	// states
	const [timerInterval, setTimerInterval] = React.useState<T_SetTimeout | null>(null);
	const [time, setTime] = React.useState(0);
	const [sets, setSets] = React.useState<("START" | "REST" | "HIGH")[]>([]);
	const [currentSet, setCurrentSet] = React.useState({ index: 0, isRest: false, isStart: true });
	const [isSoundsMuted, setIsSoundsMuted] = React.useState(false);

	// utils
	const playSound = React.useCallback(
		function playSound(mode: "ROUTINE_ITEM_COMPLETED" | "SET_COMPLETED" | "COUNTDOWN") {
			try {
				if (isSoundsMuted) return;

				(
					document.getElementById(
						mode === "ROUTINE_ITEM_COMPLETED"
							? "audio-routine-item-completed"
							: mode === "SET_COMPLETED"
							? "audio-set-completed"
							: "audio-clock-tick",
					) as HTMLAudioElement
				)?.play();

				if (mode !== "COUNTDOWN") {
					window.navigator?.vibrate(200);
				}
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
					? routineItemsStartTime
					: set.isRest
					? timeToSeconds(routineItem.restTime)
					: timeToSeconds(
							Array.isArray(routineItem.sets)
								? routineItem.sets[Math.floor(set.index / 2)]
								: routineItem.highTime,
					  ),
			);
		},
		[setTime, timeToSeconds, routineItemsStartTime],
	);

	// effects
	React.useEffect(
		function getTimerReady() {
			const numberOfSets = Array.isArray(routineItem.sets)
				? routineItem.sets.length
				: routineItem.sets;

			const set = {
				index: routineItem.status === ROUTINE_ITEMS_STATUS.COMPLETED ? numberOfSets * 2 - 2 : 0,
				isStart: routineItem.status !== ROUTINE_ITEMS_STATUS.COMPLETED,
				isRest: false,
			};

			updateTime(set, routineItem);
			setSets(
				createArray(numberOfSets * 2, 0).map((index) => {
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
			if (!timerInterval) return;

			if (time === 0) {
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
			} else if (
				!currentSet.isStart &&
				timeToSeconds(currentSet.isRest ? routineItem.restTime : routineItem.highTime) >= 10 &&
				time === 4
			) {
				playSound("COUNTDOWN");
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
			setTime(
				timeToSeconds(
					Array.isArray(routineItem.sets)
						? routineItem.sets[Math.floor(prevSet.index / 2)]
						: routineItem.highTime,
				),
			);
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

	function handleLockClick() {
		setIsUILocked((currentValue) => !currentValue);
	}

	// vars
	const isTimerRunning = timerInterval !== null;
	const isRoutineItemCompleted = routineItem.status === ROUTINE_ITEMS_STATUS.COMPLETED;
	const showNextSetButton = !isRoutineItemCompleted;
	const showPrevSetButton = currentSet.index > 0 || isRoutineItemCompleted;
	const numberOfSets = Array.isArray(routineItem.sets) ? routineItem.sets.length : routineItem.sets;

	return (
		<Block
			className={classNames(
				"tw-py-8 tw-px-4 tw-text-center dfr-text-color-gs-white",
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
				src="/@legacy/static/sounds/completed-2.mp3"
				id="audio-set-completed"
				preload="auto"
				className="tw-hidden"
			/>
			<audio
				src="/@legacy/static/sounds/completed-1.mp3"
				id="audio-routine-item-completed"
				preload="auto"
				className="tw-hidden"
			/>
			<audio
				src="/@legacy/static/sounds/countdown.mp3"
				id="audio-clock-tick"
				preload="auto"
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
					<Block className="tw-flex tw-items-center tw-justify-between">
						<Button
							variant={Button.variant.SIMPLE}
							className="tw-flex tw-h-12 tw-w-12 tw-items-center tw-justify-center"
							disabled={isUILocked}
							onClick={() => setIsSoundsMuted((currentValue) => !currentValue)}
						>
							<Icon
								icon={isSoundsMuted ? Icon.icon.VOLUME_OFF : Icon.icon.VOLUME_UP}
								size={24}
								color="dfr-text-color-gs-white"
							/>
						</Button>
						<Button
							variant={Button.variant.SIMPLE}
							className="tw-h-32 tw-w-32 tw-rounded-full tw-border-4 tw-font-bold tw-uppercase dfr-border-color-primary"
							disabled={isUILocked}
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
							className="tw-flex tw-h-12 tw-w-12 tw-items-center tw-justify-center tw-rounded-full tw-border-2 dfr-border-color-primary"
							disabled={isUILocked}
							onClick={handleResetCurrentSetClick}
						>
							<Icon
								icon={Icon.icon.REPLY}
								color="dfr-text-color-gs-white"
							/>
						</Button>
					</Block>
					<Space size={2} />
				</React.Fragment>
			)}

			<Block className="tw-text-sm">
				<Block className="tw-flex tw-items-center tw-justify-between">
					<Button
						variant={Button.variant.SIMPLE}
						className={classNames("tw-mr-auto", showPrevSetButton ? "tw-visible" : "tw-invisible")}
						disabled={isUILocked}
						onClick={handlePrevSetClick}
					>
						<Icon
							icon={Icon.icon.CHEVRON_LEFT}
							color="dfr-text-color-gs-white"
							size={24}
						/>
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
						disabled={isUILocked}
						onClick={handleNextSetClick}
					>
						<Icon
							icon={Icon.icon.CHEVRON_RIGHT}
							color="dfr-text-color-gs-white"
							size={24}
						/>
					</Button>
				</Block>
				<Space size={2} />
				<Text className="tw-mt-3 tw-text-center">
					{currentSet.isStart
						? 0
						: routineItem.status === ROUTINE_ITEMS_STATUS.COMPLETED
						? numberOfSets
						: Math[currentSet.isRest ? "ceil" : "round"](currentSet.index / 2)}
					/{numberOfSets}
				</Text>
				<Space size={4} />
				<Button
					variant={Button.variant.SIMPLE}
					onClick={handleLockClick}
				>
					<Icon
						icon={isUILocked ? Icon.icon.LOCK_OPEN : Icon.icon.LOCK_CLOSED}
						color="tw-text-white"
						size={24}
					/>
				</Button>
			</Block>
		</Block>
	);
}

export default Timer;
