import * as React from "react";
import cn from "classnames";

import { MainLayout, Page } from "~/components/layout";
import { Block, Button, InlineText, Input, Space, Text } from "~/components/primitive";
import { useEnhancedState } from "@diegofrayo/hooks";
import type DR from "@diegofrayo/types";
import { isConfirmAlertAccepted, showAlert } from "@diegofrayo/utils/browser";
import v from "@diegofrayo/v";

function Series() {
	// --- STATES & REFS ---
	const [series, setSeries, , , resetSeries] = useEnhancedState(0);
	const [cycles, , incrementCycles, , resetCycles] = useEnhancedState(0);
	const [timerStatus, setTimerStatus] = React.useState<"NOT_STARTED" | "IN_PROGRESS" | "PAUSED">(
		"NOT_STARTED",
	);
	const [doingTimeInputValue, setDoingInputValue] = React.useState(30);
	const [restTimeInputValue, setIntensityInputValue] = React.useState(30);
	const [seriesInputValue, setSeriesInputValue] = React.useState(4);
	const [timerInterval, setTimerInterval] = React.useState<DR.SetTimeout | null>(null);

	// --- VARS ---
	const PAGE_TITLE = "Series";
	const isTimerStarted = timerStatus !== "NOT_STARTED";
	const isTimerNotStarted = timerStatus === "NOT_STARTED";
	const isTimerPaused = timerStatus === "PAUSED";

	// --- UTILS ---
	function playSound(
		elementId: "audio-cycle-completed" | "audio-serie" | "audio-session-completed",
	) {
		(document.getElementById(elementId) as HTMLAudioElement)?.play();
	}

	const stopInterval = React.useCallback(
		function stopInterval() {
			if (timerInterval) clearInterval(timerInterval);
			setTimerInterval(null);
		},
		[timerInterval],
	);

	const resetUI = React.useCallback(
		function resetUI(confirmBeforeReset: boolean) {
			if (confirmBeforeReset && isConfirmAlertAccepted("Are you sure?") === false) {
				return;
			}

			resetSeries();
			resetCycles();
			stopInterval();
			setTimerStatus("NOT_STARTED");
		},
		[resetSeries, resetCycles, stopInterval, setTimerStatus],
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
		const areInputValuesValid = (
			document.getElementById("form") as HTMLFormElement
		)?.checkValidity();

		if (v.isNotTrue(areInputValuesValid)) {
			showAlert("Inputs values are not valid");
			return;
		}

		const intervalHandler = function intervalHandler() {
			setSeries((currentSeries) => {
				if (currentSeries === seriesInputValue) {
					playSound("audio-serie");
					return 1;
				}

				if (currentSeries === seriesInputValue - 1) {
					playSound("audio-cycle-completed");
					incrementCycles();
					return currentSeries + 1;
				}

				if (currentSeries < seriesInputValue) {
					playSound("audio-serie");
					return currentSeries + 1;
				}

				return currentSeries;
			});
		};

		intervalHandler();
		setTimerStatus("IN_PROGRESS");
		setTimerInterval(setInterval(intervalHandler, restTimeInputValue));
	}

	function handleResetClick() {
		resetUI(true);
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

	React.useEffect(
		function checkCyclesProgress() {
			if (doingTimeInputValue === 0) return;

			if (cycles === doingTimeInputValue) {
				playSound("audio-session-completed");
			}
		},
		[doingTimeInputValue, cycles],
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
								min="5"
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
								min="5"
								max="600"
								onChange={onInputChangeHandler(setIntensityInputValue)}
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

					{isTimerStarted ? (
						<Block className="tw-text-center">
							<Text>
								<InlineText is="strong">Current serie:</InlineText>{" "}
								<InlineText className="tw-inline-block tw-w-8 tw-text-center">{series}</InlineText>
							</Text>
							<Text>
								<InlineText is="strong">Cycles finished:</InlineText>{" "}
								<InlineText className="tw-inline-block tw-w-8 tw-text-center">{cycles}</InlineText>
							</Text>
						</Block>
					) : null}

					<audio
						src="/assets/sounds/completed-3.mp3"
						id="audio-session-completed"
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
