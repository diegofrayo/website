import * as React from "react";
import classNames from "classnames";

import { MainLayout, Page } from "~/components/layout";
import { Block, Button, InlineText, Input, Select, Space, Text } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import v from "~/lib/v";
import { isConfirmAlertAccepted, showAlert } from "~/utils/browser";
import { addLeftPadding } from "~/utils/formatting";
import { generateSlug } from "~/utils/strings";
import type {
	T_HTMLElementAttributes,
	T_ReactElement,
	T_ReactOnChangeEventHandler,
	T_ReactOnChangeEventObject,
	T_ReactSetState,
	T_SetTimeout,
} from "~/types";

function Stopwatch(): T_ReactElement {
	// --- STATES & REFS ---
	const [time, setTime] = React.useState(25);
	const [timeInputValue, setTimeInputValue] = React.useState(25);
	const [timeMeasure, setTimeMeasure] = React.useState<"seconds" | "minutes">("seconds");
	const [stopwatchAudio, setStopwatchAudio] = React.useState("completed-1");
	const [timerStatus, setTimerStatus] = React.useState<"NOT_STARTED" | "IN_PROGRESS" | "PAUSED">(
		"NOT_STARTED",
	);
	const [timerInterval, setTimerInterval] = React.useState<T_SetTimeout | null>(null);

	// --- VARS ---
	const PAGE_TITLE = "stopwatch";
	const isTimerStarted = timerStatus !== "NOT_STARTED";
	const isTimerNotStarted = timerStatus === "NOT_STARTED";
	const isTimerPaused = timerStatus === "PAUSED";

	// --- UTILS ---
	function playSound(elementId: "audio-stopwatch-completed"): void {
		(document.getElementById(elementId) as HTMLAudioElement)?.play();
	}

	const stopInterval = React.useCallback(
		function stopInterval(): void {
			if (timerInterval) {
				clearInterval(timerInterval);
			}

			setTimerInterval(null);
		},
		[timerInterval],
	);

	const updateTimeValue = React.useCallback(
		function updateTimeValue(): void {
			setTime(timeMeasure === "minutes" ? timeInputValue * 60 : timeInputValue);
		},
		[timeInputValue, timeMeasure],
	);

	const resetUI = React.useCallback(
		function resetUI(confirmBeforeReset: boolean): void {
			if (confirmBeforeReset && isConfirmAlertAccepted("Are you sure?") === false) {
				return;
			}

			stopInterval();
			updateTimeValue();
			setTimerStatus("NOT_STARTED");
		},
		[stopInterval, setTimerStatus, updateTimeValue],
	);

	// --- HANDLERS ---
	function handleStartClick(): void {
		const areInputValuesValid = (
			document.getElementById("form") as HTMLFormElement
		)?.checkValidity();

		if (v.isNotTrue(areInputValuesValid)) {
			showAlert("Inputs values are not valid");
			return;
		}

		const intervalHandler = function intervalHandler(): void {
			setTime((currentTime) => {
				if (currentTime === 0) {
					return 0;
				}

				return currentTime - 1;
			});
		};

		setTimerStatus("IN_PROGRESS");
		setTimerInterval(setInterval(intervalHandler, 1000));
	}

	function handleResetClick(): void {
		resetUI(false);
	}

	function handlePauseClick(): void {
		if (isTimerPaused) {
			handleStartClick();
		} else {
			stopInterval();
			setTimerStatus("PAUSED");
		}
	}

	function onInputChangeHandler(
		setter: T_ReactSetState<number>,
	): (event: T_ReactOnChangeEventObject) => void {
		return (event: T_ReactOnChangeEventObject): void => {
			setter(Number(event.currentTarget.value));
		};
	}

	const onStopwatchSoundSelectChangeHandler: T_ReactOnChangeEventHandler<HTMLSelectElement> =
		function onStopwatchSoundSelectChangeHandler(event) {
			setStopwatchAudio(event.currentTarget.value as typeof stopwatchAudio);
		};

	const onTimeMeasureSelectChangeHandler: T_ReactOnChangeEventHandler<HTMLSelectElement> =
		function onTimeMeasureSelectChangeHandler(event) {
			const selectedOption = event.currentTarget.value as typeof timeMeasure;

			setTimeMeasure(selectedOption);
		};

	const secondsToTime = React.useCallback(function secondsToTime(secondsParam: number): string {
		const seconds = Math.round(secondsParam);

		if (seconds < 60) {
			return `00:${addLeftPadding(seconds)}`;
		}

		if (seconds < 3600) {
			const minutes = Math.floor(seconds / 60);
			return `${addLeftPadding(minutes)}:${addLeftPadding(seconds % 60)}`;
		}

		const hours = Math.floor(seconds / (60 * 60));
		const minutes = seconds / 60 - 60 * hours;
		const lastSeconds = Math.round((minutes - Math.floor(minutes)) * 60);

		return `${addLeftPadding(
			hours,
		)}:${addLeftPadding(Math.floor(minutes))}:${addLeftPadding(lastSeconds)}`;
	}, []);

	// --- EFFECTS ---
	useDidMount(() => {
		playSound("audio-stopwatch-completed");
	});

	React.useEffect(
		function checkTimeProgress(): void {
			if (time === 0 && isTimerStarted) {
				stopInterval();
				setTime(timeInputValue);
				setTimerStatus("NOT_STARTED");
				playSound("audio-stopwatch-completed");
			}
		},
		[time, stopInterval, timeInputValue, isTimerStarted],
	);

	React.useEffect(updateTimeValue, [timeInputValue, timeMeasure, updateTimeValue]);

	return (
		<Page
			config={{
				title: PAGE_TITLE,
				disableSEO: true,
			}}
		>
			<MainLayout title={`${PAGE_TITLE}`}>
				<Block className="tw-mx-auto tw-w-96 tw-max-w-full">
					<Text className="tw-text-center tw-font-sans tw-text-4xl">
						{secondsToTime(time)
							.split("")
							.map((char, index) => {
								return (
									<InlineText
										key={generateSlug(`Stopwatch-InlineText-index-${index}`)}
										className={classNames("tw-inline-block", char !== ":" && "tw-w-8")}
									>
										{char}
									</InlineText>
								);
							})}
					</Text>
					<Space size={5} />

					<form id="form">
						<Block className="tw-flex tw-justify-between tw-gap-1">
							<Input
								componentProps={{ label: "Time" }}
								containerProps={{ className: "tw-text-left tw-flex-1 tw-flex-shrink-0 tw-min-w-0" }}
								labelProps={{ className: "tw-truncate" }}
								id="time"
								type="number"
								className="tw-text-left"
								value={String(timeInputValue)}
								disabled={isTimerStarted}
								min="1"
								max="500"
								step="1"
								onChange={onInputChangeHandler(setTimeInputValue)}
							/>
							<Select
								componentProps={{ label: "Measure" }}
								containerProps={{
									className: "tw-flex-1 tw-text-right tw-flex-shrink-0 tw-min-w-0",
								}}
								labelProps={{ className: "tw-truncate" }}
								id="select-time-measure"
								defaultValue="seconds"
								className="tw-text-right"
								disabled={isTimerStarted}
								onChange={onTimeMeasureSelectChangeHandler}
							>
								<Select.Option value="seconds">seconds</Select.Option>
								<Select.Option value="minutes">minutes</Select.Option>
							</Select>
						</Block>
						<Space size={2} />
						<Block className="tw-flex tw-justify-between tw-gap-1">
							<Select
								componentProps={{ label: "Stopwatch sound" }}
								containerProps={{ className: "tw-flex-1 tw-text-left" }}
								id="select-stopwatch-sound"
								defaultValue={stopwatchAudio}
								className="tw-text-left"
								disabled={isTimerStarted}
								onChange={onStopwatchSoundSelectChangeHandler}
							>
								<Select.Option value="tick-1">tick-1</Select.Option>
								<Select.Option value="tick-2">tick-2</Select.Option>
								<Select.Option value="tick-3">tick-3</Select.Option>
								<Select.Option value="completed-1">completed-1</Select.Option>
								<Select.Option value="completed-2">completed-2</Select.Option>
								<Select.Option value="completed-3">completed-3</Select.Option>
							</Select>
						</Block>
					</form>
					<Space size={3} />

					<Block className="tw-flex tw-justify-center tw-gap-3">
						{isTimerStarted ? (
							<ActionButton
								className="tw-border-yellow-300 tw-bg-yellow-200 tw-text-yellow-700"
								onClick={handlePauseClick}
							>
								{isTimerPaused ? "Resume" : "Pause"}
							</ActionButton>
						) : null}
						{isTimerNotStarted ? (
							<ActionButton
								className="tw-border-green-200 tw-bg-green-100 tw-text-green-600"
								onClick={handleStartClick}
							>
								Start
							</ActionButton>
						) : null}
						{isTimerStarted ? (
							<ActionButton
								className="tw-border-red-200 tw-bg-red-100 tw-text-red-600"
								onClick={handleResetClick}
							>
								Reset
							</ActionButton>
						) : null}
					</Block>
					<Space size={2} />

					<audio
						src={`/static/sounds/${stopwatchAudio}.mp3`}
						id="audio-stopwatch-completed"
						preload="auto"
						className="tw-hidden"
					/>
				</Block>
			</MainLayout>
		</Page>
	);
}

export default Stopwatch;

// --- COMPONENTS ---

type T_ActionButtonProps = T_HTMLElementAttributes["button"];

function ActionButton({ children, onClick, className }: T_ActionButtonProps): T_ReactElement {
	return (
		<Button
			variant={Button.variant.SIMPLE}
			className={classNames(
				"tw-flex tw-h-16 tw-w-16 tw-items-center tw-justify-center tw-rounded-full tw-border tw-text-sm tw-font-bold dark:tw-border-0 sm:tw-h-24 sm:tw-w-24 sm:tw-text-base",
				className,
			)}
			onClick={onClick}
		>
			{children}
		</Button>
	);
}
