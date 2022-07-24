// @ts-nocheck

import * as React from "react";

import { Block, Button, Collapsible, Icon, InlineText, Space } from "~/components/primitive";
import type { T_ReactElement } from "~/types";

import type { T_RoutineStats, T_Routine } from "../types";
import { TimerPageContext } from "../context";

function Stats({
	title = "Estadísticas",
	data,
	name,
	startTime,
	endTime,
	uploadRoutineHandler,
	deleteRoutineHandler,
}: {
	title?: string;
	data: T_RoutineStats;
	name: T_Routine["name"];
	startTime: T_Routine["startTime"];
	endTime?: T_Routine["endTime"];
	uploadRoutineHandler?: any;
	deleteRoutineHandler?: any;
}): T_ReactElement {
	// context
	const { secondsToTime, timeToSeconds } = React.useContext(TimerPageContext);

	// states
	const [elapsedTime, setElapsedTime] = React.useState("");

	// vars
	const isRenderedFromTimerScreen =
		deleteRoutineHandler === undefined && uploadRoutineHandler === undefined;

	return (
		<Collapsible
			title={title}
			className="tw-px-1 tw-pt-2"
			onShowContentHandler={() => {
				setElapsedTime(secondsToTime((new Date().getTime() - startTime.ms) / 1000));
			}}
			onHideContentHandler={() => {
				setElapsedTime("");
			}}
		>
			<Block className="tw-text-sm">
				<Block className="tw-border tw-border-b-0 dfr-border-color-secondary-inv">
					<Stats.Item
						label="rutina"
						value={name}
					/>
					<Stats.Item
						label="# ejercicios"
						value={data.totalExercises}
					/>
					<Stats.Item
						label="tiempo rutina total"
						value={data.totalTime}
					/>
				</Block>
				<Space size={1} />

				<Block className="tw-border tw-border-b-0 dfr-border-color-secondary-inv">
					<Stats.Item
						label="# ejercicios completados"
						value={data.totalCompletedExercises}
					/>
					<Stats.Item
						label="tiempo rutina completado"
						value={data.completedTime}
					/>
					<Stats.Item
						label="% rutina completada"
						value={data.completedPercent}
					/>
				</Block>
				<Space size={1} />

				<Block className="tw-border tw-border-b-0 dfr-border-color-secondary-inv">
					<Stats.Item
						label="hora inicio rutina"
						value={startTime.formatted}
					/>
					{isRenderedFromTimerScreen && (
						<React.Fragment>
							<Stats.Item
								label="hora estimada finalización"
								value={new Date(
									startTime.ms + timeToSeconds(data.totalTime) * 1000,
								).toLocaleTimeString()}
							/>{" "}
							<Stats.Item
								label="hora actual"
								value={new Date().toLocaleTimeString()}
							/>
							<Stats.Item
								label="tiempo transcurrido"
								value={elapsedTime}
							/>
							<Stats.Item
								label="tiempo restante"
								value={data.remainingTime}
							/>
						</React.Fragment>
					)}
					<Stats.Item
						label="hora fin rutina"
						value={endTime?.formatted || ""}
					/>
					<Stats.Item
						label="duración final rutina"
						value={data.finalRoutineDuration}
					/>
				</Block>
			</Block>

			{!isRenderedFromTimerScreen ? (
				<Block className="tw-mt-2 tw-flex tw-items-center tw-justify-between">
					<Button
						variant={Button.variant.DEFAULT}
						onClick={uploadRoutineHandler}
					>
						Guardar en la nube
					</Button>

					<Button
						variant={Button.variant.SIMPLE}
						className="tw-font-bold tw-underline"
						onClick={deleteRoutineHandler}
					>
						<Icon
							icon={Icon.icon.X}
							color="dfr-text-colorful-secondary-100"
						/>
					</Button>
				</Block>
			) : null}
		</Collapsible>
	);
}

Stats.Item = function StatsItem({ label, value }: { label: string; value: string | number }) {
	if (value === "") return null;

	return (
		<Block className="tw-flex tw-justify-between">
			<InlineText
				className="tw-w-2/4 tw-border-b tw-py-1 tw-px-2 dfr-border-color-secondary-inv"
				is="strong"
			>
				{label}
			</InlineText>
			<InlineText className="tw-flex tw-w-2/4 tw-items-center tw-justify-end tw-border-b tw-border-l tw-py-1 tw-px-2 tw-text-right dfr-border-color-secondary-inv">
				{value}
			</InlineText>
		</Block>
	);
};

export default Stats;
