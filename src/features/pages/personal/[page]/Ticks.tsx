import * as React from "react";

import { MainLayout, Page } from "~/components/layout";
import { Block, Button, InlineText, Input, Select, Space, Text } from "~/components/primitive";
import { useEnhancedState } from "~/hooks";
import { showAlert } from "~/utils/browser";
import { createArray } from "~/utils/objects-and-arrays";
import { isNotTrue } from "~/utils/validations";
import type {
	T_ReactElement,
	T_ReactOnChangeEventHandler,
	T_ReactOnChangeEventObject,
} from "~/types";

function Ticks(): T_ReactElement {
	// states & refs
	const [audio, setAudio] = React.useState<"01" | "02" | "03" | "04">("01");
	const [ticks, setTicks] = useEnhancedState(0);
	const [cycles, setCycles, incrementCycles] = useEnhancedState(0);
	const [timerStatus, setTimerStatus] = React.useState<"NOT_STARTED" | "IN_PROGRESS" | "PAUSED">(
		"NOT_STARTED",
	);
	const [ticksInputValue, setTicksInputValue] = React.useState(4);
	const [intensityInputValue, setIntensityInputValue] = React.useState(1000);
	const [timerInterval, setTimerInterval] = React.useState<NodeJS.Timeout | null>(null);

	// vars
	const PAGE_TITLE = "ticks";
	const isTimerStarted = timerStatus !== "NOT_STARTED";
	const isTimerNotStarted = timerStatus === "NOT_STARTED";
	const isTimerPaused = timerStatus === "PAUSED";

	// handlers
	function handleStartClick(): void {
		const areInputValuesValid = (
			document.getElementById("form") as HTMLFormElement
		)?.checkValidity();

		if (isNotTrue(areInputValuesValid)) {
			showAlert("Inputs values are not valid");
			return;
		}

		setTimerStatus("IN_PROGRESS");
		setTimerInterval(
			setInterval(() => {
				setTicks((currentTicks) => {
					if (currentTicks === ticksInputValue) {
						incrementCycles();
						return 0;
					}

					playSound();
					return currentTicks + 1;
				});
			}, intensityInputValue),
		);
	}

	function handleStopClick(): void {
		setTicks(0);
		setCycles(0);
		setTimerStatus("NOT_STARTED");
		stopInterval();
	}

	function handlePauseClick(): void {
		if (isTimerPaused) {
			handleStartClick();
		} else {
			stopInterval();
			setTimerStatus("PAUSED");
		}
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
	function playSound(): void {
		(document.getElementById("audio-tick") as HTMLAudioElement)?.play();
	}

	function stopInterval(): void {
		if (timerInterval) clearInterval(timerInterval);
		setTimerInterval(null);
	}

	return (
		<Page
			config={{
				title: PAGE_TITLE,
				disableSEO: true,
				scripts: createArray(4).map((item) => {
					return {
						element: "link",
						props: {
							rel: "preload",
							as: "audio",
							href: `/static/sounds/ticks/0${item}.mp3`,
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
							type="number"
							id="ticks"
							label="Ticks"
							containerProps={{ className: "tw-text-left tw-flex-1" }}
							className="tw-text-left"
							value={String(ticksInputValue)}
							disabled={isTimerStarted}
							min="3"
							max="10"
							onChange={onTicksInputChangeHandler}
						/>
						<Input
							type="number"
							id="intensity"
							label="Intensity"
							containerProps={{ className: "tw-text-center tw-flex-1" }}
							className="tw-text-center"
							value={String(intensityInputValue)}
							disabled={isTimerStarted}
							min="1000"
							max="5000"
							step="250"
							onChange={onIntensityInputChangeHandler}
						/>
						<Block className="tw-flex-1 tw-text-right">
							<Text className="tw-mb-1 tw-font-bold">Sound</Text>
							<Select
								defaultValue="01"
								className="tw-text-right"
								height="tw-h-[48px]"
								onChange={onSelectChangeHandler}
							>
								<Select.Option value="01">1</Select.Option>
								<Select.Option value="02">2</Select.Option>
								<Select.Option value="03">3</Select.Option>
								<Select.Option value="04">4</Select.Option>
							</Select>
						</Block>
					</form>
					<Space size={2} />

					<Block className="tw-flex tw-justify-center tw-gap-3">
						{isTimerStarted ? (
							<Button
								variant={Button.variant.SIMPLE}
								className="tw-flex tw-h-24 tw-w-24 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-yellow-300 tw-bg-yellow-200 tw-font-bold tw-text-yellow-700"
								onClick={handlePauseClick}
							>
								{isTimerPaused ? "Resume" : "Pause"}
							</Button>
						) : null}
						{isTimerNotStarted ? (
							<Button
								variant={Button.variant.SIMPLE}
								className="tw-flex tw-h-24 tw-w-24 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-green-200 tw-bg-green-100 tw-font-bold tw-text-green-600"
								onClick={handleStartClick}
							>
								Start
							</Button>
						) : null}
						{isTimerStarted ? (
							<Button
								variant={Button.variant.SIMPLE}
								className="tw-flex tw-h-24 tw-w-24 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-red-200 tw-bg-red-100 tw-font-bold tw-text-red-600"
								onClick={handleStopClick}
							>
								Stop
							</Button>
						) : null}
					</Block>
					<Space size={2} />

					{isTimerStarted ? (
						<Text className="tw-text-center">
							<InlineText is="strong">Cycles finished:</InlineText>{" "}
							<InlineText className="tw-inline-block tw-w-8 tw-text-center">{cycles}</InlineText>{" "}
							<InlineText>|</InlineText>{" "}
							<InlineText className="tw-inline-block tw-w-6 tw-text-center">{ticks}</InlineText>
						</Text>
					) : null}

					<audio
						src={`/static/sounds/ticks/${audio}.mp3`}
						id="audio-tick"
						preload="auto"
						className="tw-hidden"
					/>
				</Block>
			</MainLayout>
		</Page>
	);
}

export default Ticks;
