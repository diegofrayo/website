import * as React from "react";
import cn from "classnames";

import { MainLayout, Page } from "~/components/layout";
import {
	Block,
	Button,
	Icon,
	InlineText,
	Input,
	Select,
	Space,
	Text,
} from "~/components/primitive";
import { ClientRenderComponent } from "~/hocs";
import { generateDate, getDatesDiff } from "~/utils/dates";
import { useDidMount, useEnhancedState } from "@diegofrayo/hooks";
import type DR from "@diegofrayo/types";
import { sortBy } from "@diegofrayo/sort";
import { useBrowserStorageState } from "@diegofrayo/storage";
import { isConfirmAlertAccepted } from "@diegofrayo/utils/browser";
import { generateSlug } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";

function Ticks() {
	// --- STATES & REFS ---
	const [ticksAudio, setTicksAudio] = React.useState<"1" | "2" | "3">("1");
	const [cyclesAudio, setCyclesAudio] = React.useState<"1" | "2" | "3">("3");
	const [ticks, setTicks, , , resetTicks] = useEnhancedState(0);
	const [cycles, , incrementCycles, , resetCycles] = useEnhancedState(0);
	const [timerStatus, setTimerStatus] = React.useState<"NOT_STARTED" | "IN_PROGRESS" | "PAUSED">(
		"NOT_STARTED",
	);
	const [ticksInputValue, setTicksInputValue] = React.useState(4);
	const [intensityInputValue, setIntensityInputValue] = React.useState(1250);
	const [cyclesInputValue, setCyclesInputValue] = React.useState(135);
	const [timerInterval, setTimerInterval] = React.useState<DR.SetTimeout | null>(null);
	const currentSessionDetails = React.useRef({
		id: new Date().getTime(),
		startDate: new Date(),
	});
	const [history, setHistory] = useBrowserStorageState<
		{
			id: number;
			date: string;
			cycles: number;
			ticksPerCycle: number;
			intensity: number;
			time: string;
		}[]
	>({
		value: [],
		key: "DR_TICKS",
		saveWhenCreating: true,
		readInitialValueFromStorage: true,
	});

	// --- VARS ---
	const PAGE_TITLE = "Ticks";
	const isTimerStarted = timerStatus !== "NOT_STARTED";
	const isTimerNotStarted = timerStatus === "NOT_STARTED";
	const isTimerPaused = timerStatus === "PAUSED";

	// --- UTILS ---
	function playSound(
		elementId: "audio-cycle-completed" | "audio-tick" | "audio-session-completed",
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

	const readHistoryFromLocalStorage = React.useCallback(
		function readHistoryFromLocalStorage(): typeof history {
			return history
				.map((item) => {
					return {
						...item,
						id: v.isNumber(item.id) ? item.id : 0,
						cycles: item.cycles || 0,
						ticksPerCycle: item.ticksPerCycle || 4,
						intensity: item.intensity || 1250,
						time: item.time || "11 minutes",
					};
				})
				.sort(sortBy("-date", "-id"));
		},
		[history],
	);

	const resetUI = React.useCallback(
		function resetUI(confirmBeforeReset: boolean) {
			if (confirmBeforeReset && isConfirmAlertAccepted("Are you sure?") === false) {
				return;
			}

			resetTicks();
			resetCycles();
			stopInterval();
			setTimerStatus("NOT_STARTED");
		},
		[resetTicks, resetCycles, stopInterval, setTimerStatus],
	);

	function calculateEstimatedTime(): string {
		if (cyclesInputValue === 0) {
			return "Free session";
		}

		const resultInMinutes = Number(
			(cyclesInputValue * ticksInputValue * intensityInputValue) / 1000 / 60,
		);

		if (resultInMinutes < 1) {
			return `${String(Math.round(resultInMinutes * 60))} seconds`;
		}

		const resultInMinutesAsString = resultInMinutes.toFixed(1).toString();
		const minutes = Number(resultInMinutesAsString.split(".")[0]);
		const seconds = Number(resultInMinutesAsString.split(".")[1]) * 6;

		return `${seconds === 0 ? `${minutes} minutes` : `${minutes} minutes and ${seconds} seconds`}`;
	}

	// --- HANDLERS ---
	function handleStartClick() {
		const areInputValuesValid = (
			document.getElementById("form") as HTMLFormElement
		)?.checkValidity();

		if (v.isNotTrue(areInputValuesValid)) {
			// showAlert("Inputs values are not valid");
			return;
		}

		const intervalHandler = function intervalHandler() {
			setTicks((currentTicks) => {
				if (currentTicks === ticksInputValue) {
					playSound("audio-tick");
					return 1;
				}

				if (currentTicks === ticksInputValue - 1) {
					playSound("audio-cycle-completed");
					incrementCycles();
					return currentTicks + 1;
				}

				if (currentTicks < ticksInputValue) {
					playSound("audio-tick");
					return currentTicks + 1;
				}

				return currentTicks;
			});
		};

		currentSessionDetails.current = {
			id: new Date().getTime(),
			startDate: new Date(),
		};

		intervalHandler();
		setTimerStatus("IN_PROGRESS");
		setTimerInterval(setInterval(intervalHandler, intensityInputValue));
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

	const handleSaveClick = React.useCallback(
		function handleSaveClick() {
			const data = readHistoryFromLocalStorage();

			data.push({
				id: currentSessionDetails.current.id,
				date: generateDate(),
				cycles,
				ticksPerCycle: ticksInputValue,
				intensity: intensityInputValue,
				time: `${getDatesDiff(
					currentSessionDetails.current.startDate,
					new Date(),
					"minute",
				)} minutes`,
			});

			setHistory(data);
			resetUI(false);
		},
		[
			setHistory,
			resetUI,
			currentSessionDetails,
			ticksInputValue,
			intensityInputValue,
			readHistoryFromLocalStorage,
			cycles,
		],
	);

	function handleDeleteHistoryItemClick(itemIndex: number) {
		return () => {
			const data = readHistoryFromLocalStorage().filter((_, index) => index !== itemIndex);
			setHistory(data);
		};
	}

	function onInputChangeHandler(
		setter: DR.React.SetState<number>,
	): (event: DR.React.Events.OnChangeEvent) => void {
		return (event: DR.React.Events.OnChangeEvent) => {
			setter(Number(event.currentTarget.value));
		};
	}

	const onTicksSoundSelectChangeHandler: DR.React.Events.OnChangeEventHandler<HTMLSelectElement> =
		function onTicksSoundSelectChangeHandler(event) {
			setTicksAudio(event.currentTarget.value as typeof ticksAudio);
		};

	const onCyclesSoundSelectChangeHandler: DR.React.Events.OnChangeEventHandler<HTMLSelectElement> =
		function onCyclesSoundSelectChangeHandler(event) {
			setCyclesAudio(event.currentTarget.value as typeof cyclesAudio);
		};

	// --- EFFECTS ---
	useDidMount(() => {
		setHistory(readHistoryFromLocalStorage());
	});

	React.useEffect(
		function checkCyclesProgress() {
			if (cyclesInputValue === 0) return;

			if (cycles === cyclesInputValue) {
				handleSaveClick();
				playSound("audio-session-completed");
			}
		},
		[cyclesInputValue, cycles, handleSaveClick],
	);

	return (
		<Page
			config={{
				title: PAGE_TITLE,
				disableSEO: true,
			}}
		>
			<MainLayout title={`${PAGE_TITLE}`}>
				<Block className="tw-mx-auto tw-w-96 tw-max-w-full">
					<form id="form">
						<Block className="tw-flex tw-justify-between tw-gap-1">
							<Input
								variant={Input.variant.STYLED}
								componentProps={{ label: "Cycles" }}
								containerProps={{ className: "tw-text-left tw-flex-1" }}
								id="cycles"
								type="number"
								className="tw-text-left"
								value={String(cyclesInputValue)}
								disabled={isTimerStarted}
								min="0"
								max="500"
								step="1"
								onChange={onInputChangeHandler(setCyclesInputValue)}
							/>
							<Input
								variant={Input.variant.STYLED}
								componentProps={{ label: "Ticks" }}
								containerProps={{ className: "tw-text-center tw-flex-1" }}
								id="ticks"
								type="number"
								className="tw-text-center"
								value={String(ticksInputValue)}
								disabled={isTimerStarted}
								min="3"
								max="10"
								required
								onChange={onInputChangeHandler(setTicksInputValue)}
							/>
							<Input
								variant={Input.variant.STYLED}
								componentProps={{ label: "Intensity" }}
								containerProps={{ className: "tw-text-right tw-flex-1" }}
								id="intensity"
								type="number"
								className="tw-text-right"
								value={String(intensityInputValue)}
								disabled={isTimerStarted}
								min="1000"
								max="5000"
								step="250"
								onChange={onInputChangeHandler(setIntensityInputValue)}
								required
							/>
						</Block>
						<Space size={2} />
						<Block className="tw-flex tw-justify-between tw-gap-1">
							<Select
								variant={Select.variant.STYLED}
								componentProps={{ label: "Ticks sound" }}
								containerProps={{ className: "tw-flex-1 tw-text-left" }}
								id="select-ticks-sound"
								defaultValue="3"
								className="tw-text-left"
								onChange={onTicksSoundSelectChangeHandler}
							>
								<Select.Option value="1">1</Select.Option>
								<Select.Option value="2">2</Select.Option>
								<Select.Option value="3">3</Select.Option>
							</Select>
							<Select
								variant={Select.variant.STYLED}
								componentProps={{ label: "Cycles sound" }}
								containerProps={{ className: "tw-flex-1 tw-text-right" }}
								id="select-cycles-sound"
								defaultValue="1"
								className="tw-text-right"
								onChange={onCyclesSoundSelectChangeHandler}
							>
								<Select.Option value="1">1</Select.Option>
								<Select.Option value="2">2</Select.Option>
								<Select.Option value="3">3</Select.Option>
							</Select>
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
						{isTimerPaused ? (
							<ActionButton
								className="tw-border-blue-800 tw-bg-blue-900 tw-text-blue-600"
								onClick={handleSaveClick}
							>
								Save
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
								<InlineText is="strong">Current tick:</InlineText>{" "}
								<InlineText className="tw-inline-block tw-w-8 tw-text-center">{ticks}</InlineText>
							</Text>
							<Text>
								<InlineText is="strong">Cycles finished:</InlineText>{" "}
								<InlineText className="tw-inline-block tw-w-8 tw-text-center">{cycles}</InlineText>
							</Text>
						</Block>
					) : v.isNotEmptyArray(history) ? (
						<ClientRenderComponent>
							<Block className="tw-text-left tw-text-sm">
								<Space
									size={10}
									variant={Space.variant.DASHED}
								/>
								{history.map((item, index) => {
									return (
										<Block
											key={generateSlug(`Ticks-Text-index-${index}`)}
											className="tw-mb-4 last:tw-mb-0"
										>
											<Text className="tw-font-bold">
												<InlineText className="tw-inline-block tw-w-20">{item.date}</InlineText> |{" "}
												<InlineText className="tw-inline-block tw-w-20">
													{item.cycles} cycles
												</InlineText>
											</Text>
											<Block className="tw-flex tw-justify-between">
												<InlineText className="tw-inline-block tw-w-20">
													{item.ticksPerCycle} ticks
												</InlineText>
												<InlineText className="tw-inline-block tw-w-20">
													{item.intensity}ms
												</InlineText>
												<InlineText className="tw-inline-block tw-w-20">{item.time}</InlineText>
												<Button
													variant={Button.variant.SIMPLE}
													onClick={handleDeleteHistoryItemClick(index)}
												>
													<Icon
														icon={Icon.icon.X}
														color="tw-text-red-400"
													/>
												</Button>
											</Block>
										</Block>
									);
								})}
							</Block>
						</ClientRenderComponent>
					) : null}

					<audio
						src={`/assets/sounds/tick-${ticksAudio}.mp3`}
						id="audio-tick"
						preload="auto"
						className="tw-hidden"
					/>
					<audio
						src={`/assets/sounds/tick-${cyclesAudio}.mp3`}
						id="audio-cycle-completed"
						preload="auto"
						className="tw-hidden"
					/>
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

export default Ticks;

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
