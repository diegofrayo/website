import * as React from "react";
import cn from "classnames";

import { MainLayout, Page } from "~/components/layout";
import { Block, Button, InlineText, Input, Space, Text } from "~/components/primitive";
import { BoxWithTitle } from "~/components/shared";
import type DR from "@diegofrayo/types";
import { showAlert } from "@diegofrayo/utils/browser";
import { addLeftPadding } from "@diegofrayo/utils/strings";

function Series() {
	// --- STATES & REFS ---
	const [timerStatus, setTimerStatus] = React.useState<"NOT_STARTED" | "IN_PROGRESS">(
		"NOT_STARTED",
	);
	const [doingTimeInputValue, setDoingInputValue] = React.useState(30);
	const [restTimeInputValue, setRestTimeInputValue] = React.useState(30);
	const [seriesInputValue, setSeriesInputValue] = React.useState(2);
	const [timerInterval, setTimerInterval] = React.useState<DR.SetTimeout | null>(null);
	const [timeCounter, setTimeCounter] = React.useState<{
		type: "NOT_STARTED" | "STARTING" | "DOING" | "REST";
		value: number;
	}>({
		type: "NOT_STARTED",
		value: 0,
	});
	const [seriesCounter, setSeriesCounter] = React.useState(0);

	// --- VARS ---
	const PAGE_TITLE = "Series";
	const isTimerStarted = timerStatus !== "NOT_STARTED";
	const isTimerNotStarted = timerStatus === "NOT_STARTED";

	// --- UTILS ---
	function playSound(elementId: "audio-tick" | "audio-completed" | "audio-start" | "audio-rest") {
		(document.getElementById(elementId) as HTMLAudioElement)?.play();
	}

	const startInterval = React.useCallback(
		function startInterval() {
			setTimerStatus("IN_PROGRESS");
			setTimeCounter((currentState) => {
				const isDoingTime = currentState.type === "DOING";
				const isNotStartedTime = currentState.type === "NOT_STARTED";

				if (isNotStartedTime) {
					return {
						type: "STARTING",
						value: 5,
					};
				}

				if (isDoingTime) {
					playSound("audio-rest");

					return {
						type: "REST",
						value: restTimeInputValue,
					};
				}

				playSound("audio-start");
				return {
					type: "DOING",
					value: doingTimeInputValue,
				};
			});

			setTimerInterval(
				setInterval(function intervalHandler() {
					setTimeCounter((currentState) => {
						return {
							...currentState,
							value: currentState.value - 1,
						};
					});
				}, 1000),
			);
		},
		[doingTimeInputValue, restTimeInputValue],
	);

	const stopInterval = React.useCallback(
		function stopInterval() {
			if (timerInterval) {
				clearInterval(timerInterval);
			}

			setTimerInterval(null);
		},
		[timerInterval],
	);

	const resetUI = React.useCallback(
		function resetUI() {
			stopInterval();
			setSeriesCounter(0);
			setTimerStatus("NOT_STARTED");
			setTimeCounter({ type: "NOT_STARTED", value: 0 });
		},
		[stopInterval, setTimerStatus, setSeriesCounter, setTimeCounter],
	);

	function calculateEstimatedTime() {
		const resultInMinutes = Number(
			(doingTimeInputValue * seriesInputValue + restTimeInputValue * (seriesInputValue - 1)) / 60,
		);

		if (resultInMinutes < 1) {
			return `${String(Math.round(resultInMinutes * 60))} seconds`;
		}

		const resultInMinutesAsString = resultInMinutes.toFixed(6).toString();
		const minutes = Number(resultInMinutesAsString.split(".")[0]);
		const seconds = Number((Number(`0.${resultInMinutesAsString.split(".")[1]}`) * 60).toFixed(0));

		return `${seconds === 0 ? `${minutes} minutes` : `${minutes} minutes and ${seconds} seconds`}`;
	}

	function secondsToTime(input: number) {
		const seconds = Math.round(input);

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
	}

	// --- HANDLERS ---
	async function handleStartClick() {
		startInterval();
	}

	function handleResetClick() {
		resetUI();
	}

	function onInputChangeHandler(
		setter: DR.React.SetState<number>,
	): (event: DR.React.Events.OnChangeEvent) => void {
		return (event: DR.React.Events.OnChangeEvent) => {
			setter(Number(event.currentTarget.value));
		};
	}

	// --- EFFECTS ---
	React.useEffect(
		function checkTimeProgress() {
			if (!timerInterval) return;

			if (timeCounter.value === 0) {
				stopInterval();

				if (timeCounter.type === "STARTING") {
					startInterval();
					return;
				}

				const newSeriesCounter = seriesCounter + 1;
				setSeriesCounter(newSeriesCounter);

				if (newSeriesCounter === seriesInputValue * 2 - 1) {
					playSound("audio-completed");

					setTimeout(() => {
						showAlert("Completed");
						resetUI();
					}, 1000);
				} else {
					startInterval();
				}
			} else if (timeCounter.type === "DOING" || timeCounter.type === "STARTING") {
				playSound("audio-tick");
			}
		},
		[
			resetUI,
			startInterval,
			stopInterval,
			seriesCounter,
			seriesInputValue,
			timeCounter,
			timerInterval,
			timerStatus,
		],
	);

	return (
		<Page
			config={{
				title: PAGE_TITLE,
				disableSEO: true,
			}}
		>
			<MainLayout title={PAGE_TITLE}>
				<Block className="tw-mx-auto tw-w-96 tw-max-w-full">
					<BoxWithTitle
						title="Details"
						className={cn(
							"tw-px-2 tw-pb-4 tw-pt-6 tw-text-center",
							timerStatus === "NOT_STARTED" ? "tw-hidden" : "tw-block",
						)}
					>
						<Text className="tw-font-mono tw-text-7xl tw-text-white">
							{secondsToTime(timeCounter.value)}
						</Text>

						<Text className="tw-text-4xl tw-font-bold tw-uppercase">{timeCounter.type}</Text>
						<Space size={1} />

						{timeCounter.type === "DOING" || timeCounter.type === "REST" ? (
							<Text>
								{Math[timeCounter.type === "REST" ? "ceil" : "round"]((seriesCounter + 1) / 2)}/
								{seriesInputValue}
							</Text>
						) : null}
					</BoxWithTitle>
					<Space size={2} />

					<BoxWithTitle
						title="Config"
						className="tw-px-4 tw-pb-4 tw-pt-6"
					>
						<Block>
							<Input
								variant={Input.variant.STYLED}
								componentProps={{ label: "Doing time" }}
								labelProps={{ className: "tw-text-sm" }}
								id="input-doing-time"
								type="number"
								value={String(doingTimeInputValue)}
								disabled={isTimerStarted}
								min="1"
								max="600"
								onChange={onInputChangeHandler(setDoingInputValue)}
								required
							/>
							<Space size={2} />

							<Input
								variant={Input.variant.STYLED}
								componentProps={{ label: "Rest time" }}
								labelProps={{ className: "tw-text-sm" }}
								id="input-rest-time"
								type="number"
								value={String(restTimeInputValue)}
								disabled={isTimerStarted}
								min="1"
								max="600"
								onChange={onInputChangeHandler(setRestTimeInputValue)}
								required
							/>
							<Space size={2} />

							<Input
								variant={Input.variant.STYLED}
								componentProps={{ label: "Series" }}
								labelProps={{ className: "tw-text-sm" }}
								id="input-series-time"
								type="number"
								value={String(seriesInputValue)}
								disabled={isTimerStarted}
								min="1"
								max="10"
								onChange={onInputChangeHandler(setSeriesInputValue)}
								required
							/>
						</Block>
						<Space size={1} />

						<Text className="tw-text-center tw-text-sm tw-text-white">
							<InlineText is="strong">Estimated time: </InlineText>
							<InlineText>{calculateEstimatedTime()}</InlineText>
						</Text>
						<Space size={3} />

						<Block className="tw-flex tw-justify-center tw-gap-3">
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
					</BoxWithTitle>
					<Space size={2} />

					<audio
						src="/assets/sounds/tick-1.mp3"
						id="audio-tick"
						preload="auto"
						className="tw-hidden"
					/>
					<audio
						src="/assets/sounds/completed-1.mp3"
						id="audio-completed"
						preload="auto"
						className="tw-hidden"
					/>
					<audio
						src="/assets/sounds/start.mp3"
						id="audio-start"
						preload="auto"
						className="tw-hidden"
					/>
					<audio
						src="/assets/sounds/rest.mp3"
						id="audio-rest"
						preload="auto"
						className="tw-hidden"
					/>
				</Block>
			</MainLayout>
		</Page>
	);
}

export default Series;

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
