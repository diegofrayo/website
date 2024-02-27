import * as React from "react";
import cn from "classnames";

import { MainLayout, Page } from "~/components/layout";
import { Block, Button, InlineText, Input, Select, Space, Text } from "~/components/primitive";
import type DR from "@diegofrayo/types";
import { isConfirmAlertAccepted, showAlert } from "@diegofrayo/utils/browser";
import { addLeftPadding, generateSlug } from "@diegofrayo/utils/strings";

function Stopwatch() {
	// --- STATES & REFS ---
	const [time, setTime] = React.useState(25);
	const [timeInputValue, setTimeInputValue] = React.useState(25);
	const [timeMeasure, setTimeMeasure] = React.useState<"seconds" | "minutes">("seconds");
	const [stopwatchAudio, setStopwatchAudio] = React.useState("completed-1");
	const [timerStatus, setTimerStatus] = React.useState<"NOT_STARTED" | "IN_PROGRESS" | "PAUSED">(
		"NOT_STARTED",
	);
	const [timerInterval, setTimerInterval] = React.useState<DR.SetTimeout | null>(null);

	// --- VARS ---
	const PAGE_TITLE = "Stopwatch";
	const isTimerStarted = timerStatus !== "NOT_STARTED";
	const isTimerNotStarted = timerStatus === "NOT_STARTED";
	const isTimerPaused = timerStatus === "PAUSED";

	// --- UTILS ---
	function playSound(elementId: "audio-stopwatch-completed" | "audio-tick") {
		(document.getElementById(elementId) as HTMLAudioElement)?.play();
	}

	const stopInterval = React.useCallback(
		function stopInterval() {
			if (timerInterval) {
				clearInterval(timerInterval);
			}

			setTimerInterval(null);
		},
		[timerInterval],
	);

	const updateTimeValue = React.useCallback(
		function updateTimeValue() {
			setTime(timeMeasure === "minutes" ? timeInputValue * 60 : timeInputValue);
		},
		[timeInputValue, timeMeasure],
	);

	const resetUI = React.useCallback(
		function resetUI(confirmBeforeReset: boolean) {
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
	function handleStartClick() {
		const isFormValid = (document.getElementById("form") as HTMLFormElement)?.checkValidity();

		if (isFormValid === false) {
			showAlert("Inputs values are not valid");
			return;
		}

		const intervalHandler = function intervalHandler() {
			setTime((currentTime) => {
				if (currentTime === 0) {
					return 0;
				}

				return currentTime - 1;
			});
		};

		playSound("audio-tick");
		setTimerStatus("IN_PROGRESS");
		setTimerInterval(setInterval(intervalHandler, 1000));
	}

	function handleResetClick() {
		resetUI(false);
	}

	function handlePauseClick() {
		if (isTimerPaused) {
			handleStartClick();
		} else {
			stopInterval();
			setTimerStatus("PAUSED");
		}
	}

	function onInputChangeHandler(
		setter: DR.React.SetState<number>,
	): (event: DR.React.Events.OnChangeEvent) => void {
		return (event: DR.React.Events.OnChangeEvent) => {
			setter(Number(event.currentTarget.value));
		};
	}

	const onStopwatchSoundSelectChangeHandler: DR.React.Events.OnChangeEventHandler<HTMLSelectElement> =
		function onStopwatchSoundSelectChangeHandler(event) {
			setStopwatchAudio(event.currentTarget.value as typeof stopwatchAudio);
		};

	const onTimeMeasureSelectChangeHandler: DR.React.Events.OnChangeEventHandler<HTMLSelectElement> =
		function onTimeMeasureSelectChangeHandler(event) {
			const selectedOption = event.currentTarget.value as typeof timeMeasure;

			setTimeMeasure(selectedOption);
		};

	const secondsToTime = React.useCallback(function secondsToTime(secondsParam: number) {
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

		return `${addLeftPadding(hours)}:${addLeftPadding(Math.floor(minutes))}:${addLeftPadding(
			lastSeconds,
		)}`;
	}, []);

	// --- EFFECTS ---
	React.useEffect(
		function checkTimeProgress() {
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
										className={cn("tw-inline-block", char !== ":" && "tw-w-8")}
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
								variant={Input.variant.STYLED}
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
								variant={Select.variant.STYLED}
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
								<Select.Option
									value="seconds"
									className="tw-capitalize"
								>
									seconds
								</Select.Option>
								<Select.Option
									value="minutes"
									className="tw-capitalize"
								>
									minutes
								</Select.Option>
							</Select>
						</Block>
						<Space size={2} />
						<Block className="tw-flex tw-justify-between tw-gap-1">
							<Select
								variant={Select.variant.STYLED}
								componentProps={{ label: "Stopwatch sound" }}
								containerProps={{ className: "tw-flex-1 tw-text-left" }}
								id="select-stopwatch-sound"
								defaultValue={stopwatchAudio}
								className="tw-text-left"
								disabled={isTimerStarted}
								onChange={onStopwatchSoundSelectChangeHandler}
							>
								<Select.Option
									value="tick-1"
									className="tw-capitalize"
								>
									tick-1
								</Select.Option>
								<Select.Option
									value="tick-2"
									className="tw-capitalize"
								>
									tick-2
								</Select.Option>
								<Select.Option
									value="tick-3"
									className="tw-capitalize"
								>
									tick-3
								</Select.Option>
								<Select.Option
									value="completed-1"
									className="tw-capitalize"
								>
									completed-1
								</Select.Option>
								<Select.Option
									value="completed-2"
									className="tw-capitalize"
								>
									completed-2
								</Select.Option>
								<Select.Option
									value="completed-3"
									className="tw-capitalize"
								>
									completed-3
								</Select.Option>
							</Select>
						</Block>
					</form>
					<Space size={3} />

					<Block className="tw-flex tw-justify-center tw-gap-3">
						{isTimerStarted ? (
							<ActionButton
								className="tw-border-yellow-500 tw-bg-yellow-600 tw-text-yellow-300"
								onClick={handlePauseClick}
							>
								{isTimerPaused ? "Resume" : "Pause"}
							</ActionButton>
						) : null}
						{isTimerNotStarted ? (
							<ActionButton
								className="tw-border-green-800 tw-bg-green-900 tw-text-green-600"
								onClick={handleStartClick}
							>
								Start
							</ActionButton>
						) : null}
						{isTimerStarted ? (
							<ActionButton
								className="tw-border-red-800 tw-bg-red-900 tw-text-red-600"
								onClick={handleResetClick}
							>
								Reset
							</ActionButton>
						) : null}
					</Block>
					<Space size={2} />

					<audio
						src={`/assets/sounds/${stopwatchAudio}.mp3`}
						id="audio-stopwatch-completed"
						preload="auto"
						className="tw-hidden"
					/>
					<audio
						src="/assets/sounds/tick-1.mp3"
						id="audio-tick"
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

type T_ActionButtonProps = DR.DOM.HTMLElementAttributes["button"];

function ActionButton({ children, onClick, className }: T_ActionButtonProps) {
	return (
		<Button
			variant={Button.variant.SIMPLE}
			className={cn(
				"tw-flex tw-h-16 tw-w-16 tw-items-center tw-justify-center tw-rounded-full tw-border tw-text-xs tw-font-bold sm:tw-h-24 sm:tw-w-24 sm:tw-text-base",
				className,
			)}
			onClick={onClick}
		>
			{children}
		</Button>
	);
}
