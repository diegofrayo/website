// @ts-nocheck

import * as React from "react";
import classNames from "classnames";

import { Block, Button, Icon, InlineText, Space, Text, Title } from "~/@legacy/src/components/primitive";
import v from "~/@legacy/src/lib/v";
import { pluralize } from "~/@legacy/src/utils/strings";
import type { T_ReactElement } from "~/@legacy/src/types";

import { ROUTINE_ITEMS_STATUS } from "../constants";
import { TimerPageContext } from "../context";
import type { T_RoutineItem } from "../types";

export default function RoutineItem({
	id,
	status,
	title,
	sets = 1,
	highTime,
	restTime,
	notes,
}: T_RoutineItem): T_ReactElement {
	// context
	const {
		// states
		currentRoutine,
		isUILocked,

		// utils
		setRoutineItemAsStarted,
		calculateRoutineItemTotalTime,
		secondsToTime,
		markRoutineItemAsCompleted,
	} = React.useContext(TimerPageContext);

	// states
	const [isTitleTruncated, setIsTitleTruncated] = React.useState(true);

	// vars
	const borderStyles = {
		"tw-border-gray-200 tw-bg-gray-100": status === ROUTINE_ITEMS_STATUS.NOT_STARTED,
		"tw-border-yellow-200 tw-bg-yellow-100": status === ROUTINE_ITEMS_STATUS.IN_PROGRESS,
		"tw-border-green-200 tw-bg-green-100": status === ROUTINE_ITEMS_STATUS.COMPLETED,
	};

	// handlers
	function handleMarkAsCompletedClick() {
		markRoutineItemAsCompleted(currentRoutine, id, status, "SEARCH_FOR_NEXT_ROUTINE_ITEM");
	}

	function handleStartRoutineItemClick() {
		setRoutineItemAsStarted(currentRoutine, id);
	}

	return (
		<Block
			is="article"
			className={classNames(
				"dfr-RoutineItem tw-mb-3 tw-border dfr-shadow last:tw-mb-0",
				borderStyles,
			)}
		>
			<Block
				is="header"
				className={classNames(
					"tw-flex tw-items-center tw-justify-between tw-border-b tw-px-3 tw-py-2",
					{
						"tw-border-gray-200": status === ROUTINE_ITEMS_STATUS.NOT_STARTED,
						"tw-border-yellow-200": status === ROUTINE_ITEMS_STATUS.IN_PROGRESS,
						"tw-border-green-200": status === ROUTINE_ITEMS_STATUS.COMPLETED,
					},
				)}
			>
				<Title
					is="h1"
					variant={Title.variant.UNSTYLED}
					size={Title.size.SM}
					className={classNames(
						"tw-min-w-0 tw-flex-1 dfr-text-color-gs-black",
						isTitleTruncated && "tw-truncate",
					)}
					onClick={() => {
						setIsTitleTruncated((currentValue) => !currentValue);
					}}
				>
					{title}
				</Title>
				<Text className="tw-ml-3 tw-text-right tw-text-xs tw-font-bold tw-italic">
					{pluralize(Array.isArray(sets) ? sets.length : sets, "repetición", "repeticiones")}
				</Text>
			</Block>
			<Block className="tw-px-3 tw-py-3">
				{highTime ? (
					<Block className="tw-flex tw-items-center tw-justify-between">
						<InlineText className="tw-text-sm">Tiempo de acción</InlineText>
						<InlineText className="tw-w-20 tw-rounded-lg tw-bg-red-600 tw-py-1 tw-px-2 tw-text-center tw-text-xs tw-font-bold dfr-text-color-gs-white">
							{highTime}
						</InlineText>
					</Block>
				) : null}
				{restTime ? (
					<React.Fragment>
						<Space size={0.5} />
						<Block className="tw-flex tw-items-center tw-justify-between">
							<InlineText className="tw-text-sm">Tiempo de descanso</InlineText>
							<InlineText className="tw-w-20 tw-rounded-lg tw-bg-blue-600 tw-py-1 tw-px-2 tw-text-center tw-text-xs tw-font-bold dfr-text-color-gs-white">
								{restTime}
							</InlineText>
						</Block>
						<Space size={0.5} />
						<Block className="tw-flex tw-items-center tw-justify-between">
							<InlineText className="tw-text-sm">Tiempo total</InlineText>
							<InlineText className="tw-w-20 tw-rounded-lg tw-bg-green-600 tw-py-1 tw-px-2 tw-text-center tw-text-xs tw-font-bold dfr-text-color-gs-white">
								{secondsToTime(calculateRoutineItemTotalTime(sets, highTime, restTime))}
							</InlineText>
						</Block>
						{v.isNotEmptyString(notes) ? (
							<React.Fragment>
								<Space size={1.5} />
								<Block
									className={classNames(
										"tw-rounded-md tw-border-0 tw-bg-opacity-50 tw-px-2 tw-pt-1 tw-pb-2",
										{
											"tw-bg-gray-300": status === ROUTINE_ITEMS_STATUS.NOT_STARTED,
											"tw-bg-yellow-300": status === ROUTINE_ITEMS_STATUS.IN_PROGRESS,
											"tw-bg-green-300": status === ROUTINE_ITEMS_STATUS.COMPLETED,
										},
									)}
								>
									<Text className="tw-mb-2 tw-text-sm tw-font-bold">Notas</Text>
									<Text className="tw-text-xs tw-italic dfr-text-color-gs-black">"{notes}"</Text>
								</Block>
							</React.Fragment>
						) : null}
					</React.Fragment>
				) : null}
				<Space size={2} />
				<Block
					className={classNames(
						"tw-flex tw-items-center tw-justify-between tw-border-t tw-pt-1",
						borderStyles,
					)}
				>
					{status === ROUTINE_ITEMS_STATUS.NOT_STARTED && (
						<Button
							variant={Button.variant.SIMPLE}
							disabled={isUILocked}
							onClick={handleStartRoutineItemClick}
						>
							<Icon
								icon={Icon.icon.PLAY}
								size={12}
							/>
							<InlineText className="tw-ml-1 tw-align-middle tw-text-xxs">iniciar</InlineText>
						</Button>
					)}

					<Button
						variant={Button.variant.SIMPLE}
						className="tw-ml-auto"
						disabled={isUILocked}
						onClick={handleMarkAsCompletedClick}
					>
						<Icon
							icon={Icon.icon.CHECK}
							size={12}
						/>
						<InlineText className="tw-ml-1 tw-align-middle tw-text-xxs">
							marcar como{" "}
							{status === ROUTINE_ITEMS_STATUS.COMPLETED
								? ROUTINE_ITEMS_STATUS.NOT_STARTED
								: ROUTINE_ITEMS_STATUS.COMPLETED}
						</InlineText>
					</Button>
				</Block>
			</Block>
		</Block>
	);
}
