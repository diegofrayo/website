import * as React from "react";
import cn from "classnames";

import { MainLayout, Page } from "~/components/layout";
import { Block, Button, InlineText, Input, Space, Text } from "~/components/primitive";
import type DR from "@diegofrayo/types";

function Series() {
	// --- STATES & REFS ---
	const [timerStatus, setTimerStatus] = React.useState<"NOT_STARTED" | "IN_PROGRESS" | "PAUSED">(
		"NOT_STARTED",
	);
	const [doingTimeInputValue, setDoingInputValue] = React.useState(30);
	const [restTimeInputValue, setRestTimeInputValue] = React.useState(30);
	const [seriesInputValue, setSeriesInputValue] = React.useState(2);
	const [timerInterval, setTimerInterval] = React.useState<DR.SetTimeout | null>(null);
	const [timeCounter, setTimeCounter] = React.useState<{ type: "doing" | "rest"; value: number }>({
		type: "rest",
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
				const isDoingTime = currentState.type === "doing";

				if (isDoingTime) {
					playSound("audio-rest");

					return {
						type: "rest",
						value: restTimeInputValue,
					};
				}

				playSound("audio-start");
				return {
					type: "doing",
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
			setTimeCounter({ type: "rest", value: 0 });
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

	// --- HANDLERS ---
	function handleStartClick() {
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

				const newSeriesCounter = seriesCounter + 1;
				setSeriesCounter(newSeriesCounter);

				if (newSeriesCounter === seriesInputValue * 2 - 1) {
					playSound("audio-completed");
					resetUI();
				} else {
					startInterval();
				}
			} else if (timeCounter.type === "doing") {
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
					<form id="form">
						<Block className="tw-flex tw-justify-between tw-gap-1">
							<Input
								variant={Input.variant.STYLED}
								componentProps={{ label: "Doing time" }}
								containerProps={{ className: "tw-text-left tw-flex-1" }}
								id="input-doing-time"
								type="number"
								className="tw-text-left"
								value={String(doingTimeInputValue)}
								disabled={isTimerStarted}
								min="1"
								max="600"
								onChange={onInputChangeHandler(setDoingInputValue)}
								required
							/>
							<Input
								variant={Input.variant.STYLED}
								componentProps={{ label: "Rest time" }}
								containerProps={{ className: "tw-text-center tw-flex-1" }}
								id="input-rest-time"
								type="number"
								className="tw-text-center"
								value={String(restTimeInputValue)}
								disabled={isTimerStarted}
								min="1"
								max="600"
								onChange={onInputChangeHandler(setRestTimeInputValue)}
								required
							/>
							<Input
								variant={Input.variant.STYLED}
								componentProps={{ label: "Series" }}
								containerProps={{ className: "tw-text-right tw-flex-1" }}
								id="input-series-time"
								type="number"
								className="tw-text-right"
								value={String(seriesInputValue)}
								disabled={isTimerStarted}
								min="1"
								max="10"
								onChange={onInputChangeHandler(setSeriesInputValue)}
								required
							/>
						</Block>
						<Space size={2} />
						<Text className="tw-text-center">
							<InlineText is="strong">Estimated time: </InlineText>
							<InlineText>{calculateEstimatedTime()}</InlineText>
						</Text>
					</form>
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
					<Space size={2} />

					{isTimerStarted ? (
						<Block className="tw-text-center">
							<Text>
								<InlineText is="strong">Current serie:</InlineText>{" "}
								<InlineText className="tw-inline-block tw-w-8 tw-text-center">
									{seriesCounter}
								</InlineText>
							</Text>
						</Block>
					) : null}

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
