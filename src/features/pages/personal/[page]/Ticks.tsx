import * as React from "react";
import classNames from "classnames";

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
import { useDidMount, useEnhancedState } from "~/hooks";
import { isConfirmAlertAccepted, showAlert } from "~/utils/browser";
import { generateDate, getDatesDiff } from "~/utils/dates";
import { createArray } from "~/utils/objects-and-arrays";
import { createRandomString, generateSlug } from "~/utils/strings";
import { isNotTrue } from "~/utils/validations";
import type {
	T_HTMLElementAttributes,
	T_ReactElement,
	T_ReactOnChangeEventHandler,
	T_ReactOnChangeEventObject,
} from "~/types";

function Ticks(): T_ReactElement {
	// states & refs
	const [audio, setAudio] = React.useState<"1" | "2">("1");
	const [ticks, setTicks, , , resetTicks] = useEnhancedState(0);
	const [cycles, , incrementCycles, , resetCycles] = useEnhancedState(0);
	const [timerStatus, setTimerStatus] = React.useState<"NOT_STARTED" | "IN_PROGRESS" | "PAUSED">(
		"NOT_STARTED",
	);
	const [ticksInputValue, setTicksInputValue] = React.useState(4);
	const [intensityInputValue, setIntensityInputValue] = React.useState(1250);
	const [timerInterval, setTimerInterval] = React.useState<NodeJS.Timeout | null>(null);
	const currentSessionDetails = React.useRef({ startDate: new Date(), id: createRandomString(16) });
	const [history, setHistory] = React.useState<
		{
			id: string;
			date: string;
			cycles: number;
			ticksPerCycle: number;
			intensity: number;
			time: string;
		}[]
	>([]);

	// vars
	const PAGE_TITLE = "ticks";
	const LOCAL_STORAGE_KEY = "DFR_TICKS";
	const isTimerStarted = timerStatus !== "NOT_STARTED";
	const isTimerNotStarted = timerStatus === "NOT_STARTED";
	const isTimerPaused = timerStatus === "PAUSED";

	// effects
	useDidMount(() => {
		setHistory(readHistoryFromLocalStorage());
	});

	// handlers
	function handleStartClick(): void {
		const areInputValuesValid = (
			document.getElementById("form") as HTMLFormElement
		)?.checkValidity();

		if (isNotTrue(areInputValuesValid)) {
			showAlert("Inputs values are not valid");
			return;
		}

		const intervalHandler = function intervalHandler(): void {
			setTicks((currentTicks) => {
				if (currentTicks === ticksInputValue) {
					playSound();
					return 1;
				}

				if (currentTicks === ticksInputValue - 1) {
					playSound("audio-cycle-completed");
					incrementCycles();
					return currentTicks + 1;
				}

				if (currentTicks < ticksInputValue) {
					playSound();
					return currentTicks + 1;
				}

				return currentTicks;
			});
		};

		currentSessionDetails.current = {
			id: createRandomString(16),
			startDate: new Date(),
		};

		intervalHandler();
		setTimerStatus("IN_PROGRESS");
		setTimerInterval(setInterval(intervalHandler, intensityInputValue));
	}

	function handleResetClick(): void {
		resetUI(true);
	}

	function handlePauseClick(): void {
		if (isTimerPaused) {
			handleStartClick();
		} else {
			stopInterval();
			setTimerStatus("PAUSED");
		}
	}

	function handleSaveClick(): void {
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

		window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
		setHistory(data);
		resetUI(false);
	}

	function handleDeleteHistoryItemClick(itemIndex: number) {
		return (): void => {
			const data = readHistoryFromLocalStorage().filter((_, index) => index !== itemIndex);

			window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
			setHistory(data);
		};
	}

	function onTicksInputChangeHandler(event: T_ReactOnChangeEventObject): void {
		setTicksInputValue(Number(event.currentTarget.value));
	}

	function onIntensityInputChangeHandler(event: T_ReactOnChangeEventObject): void {
		setIntensityInputValue(Number(event.currentTarget.value));
	}

	const onSelectChangeHandler: T_ReactOnChangeEventHandler<HTMLSelectElement> =
		function onSelectChangeHandler(event) {
			setAudio(event.currentTarget.value as typeof audio);
		};

	// utils
	function playSound(elementId?: "audio-cycle-completed" | "audio-tick"): void {
		(document.getElementById(elementId || "audio-tick") as HTMLAudioElement)?.play();
	}

	function stopInterval(): void {
		if (timerInterval) clearInterval(timerInterval);
		setTimerInterval(null);
	}

	function readHistoryFromLocalStorage(): typeof history {
		return JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
	}

	function resetUI(confirmBeforeReset: boolean): void {
		if (confirmBeforeReset && isConfirmAlertAccepted("Are you sure?") === false) {
			return;
		}

		resetTicks();
		resetCycles();
		stopInterval();
		setTimerStatus("NOT_STARTED");
	}

	return (
		<Page
			config={{
				title: PAGE_TITLE,
				disableSEO: true,
				scripts: createArray(3).map((item) => {
					return {
						element: "link",
						props: {
							rel: "preload",
							as: "audio",
							href: `/static/sounds/ticks/${item}.mp3`,
						},
					};
				}),
			}}
		>
			<MainLayout title={`${PAGE_TITLE}`}>
				<Block>
					<form
						id="form"
						className="tw-mx-auto tw-flex tw-w-96 tw-max-w-full tw-justify-between tw-gap-1"
					>
						<Input
							componentProps={{ label: "Ticks" }}
							containerProps={{ className: "tw-text-left tw-flex-1" }}
							id="ticks"
							type="number"
							className="tw-text-left"
							value={String(ticksInputValue)}
							disabled={isTimerStarted}
							min="3"
							max="10"
							onChange={onTicksInputChangeHandler}
						/>
						<Input
							componentProps={{ label: "Intensity" }}
							containerProps={{ className: "tw-text-center tw-flex-1" }}
							id="intensity"
							type="number"
							className="tw-text-center"
							value={String(intensityInputValue)}
							disabled={isTimerStarted}
							min="1000"
							max="5000"
							step="250"
							onChange={onIntensityInputChangeHandler}
						/>
						<Select
							componentProps={{ label: "Sound" }}
							containerProps={{ className: "tw-flex-1 tw-text-right" }}
							id="select-sounds"
							defaultValue="1"
							className="tw-text-right"
							onChange={onSelectChangeHandler}
						>
							<Select.Option value="1">1</Select.Option>
							<Select.Option value="2">2</Select.Option>
						</Select>
					</form>
					<Space size={2} />
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
						{isTimerPaused ? (
							<ActionButton
								className="tw-border-blue-200 tw-bg-blue-100 tw-text-blue-600"
								onClick={handleSaveClick}
							>
								Save
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
					) : (
						<Block className="tw-mt-6 tw-text-left tw-text-sm">
							{history.map((item, index) => {
								return (
									<Block
										key={generateSlug(`Ticks-Text-index-${index}`)}
										className="tw-mb-2 last:tw-mb-0"
									>
										<Text className="tw-font-bold">
											<InlineText className="tw-inline-block tw-w-20">{item.date}</InlineText> |{" "}
											<InlineText className="tw-inline-block tw-w-20">
												{" "}
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
					)}

					<audio
						src={`/static/sounds/ticks/${audio}.mp3`}
						id="audio-tick"
						preload="auto"
						className="tw-hidden"
					/>
					<audio
						src="/static/sounds/ticks/3.mp3"
						id="audio-cycle-completed"
						preload="auto"
						className="tw-hidden"
					/>
				</Block>
			</MainLayout>
		</Page>
	);
}

export default Ticks;

// --- Components ---

type T_ActionButtonProps = T_HTMLElementAttributes["button"];

function ActionButton({ children, onClick, className }: T_ActionButtonProps): T_ReactElement {
	return (
		<Button
			variant={Button.variant.SIMPLE}
			className={classNames(
				"tw-flex tw-h-16 tw-w-16 tw-items-center tw-justify-center tw-rounded-full tw-border tw-text-sm tw-font-bold sm:tw-h-24 sm:tw-w-24 sm:tw-text-base",
				className,
			)}
			onClick={onClick}
		>
			{children}
		</Button>
	);
}
