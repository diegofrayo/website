// @ts-nocheck

import * as React from "react";
import { useTheme } from "next-themes";

import { Page } from "~/components/layout";
import { Block, Button, Icon, InlineText, Space, Text, Title } from "~/components/primitive";
import { GoBack, Render } from "~/components/shared";
import { withAuth } from "~/auth";
import { useDidMount, useQuery } from "~/hooks";
import http from "~/lib/http";
import { isDevelopmentEnvironment } from "~/utils/app";
import { setScrollPosition } from "~/utils/browser";
import { ENV_VARS } from "~/utils/constants";
import { delay } from "~/utils/misc";
import { sortBy } from "~/utils/objects-and-arrays";
import { generateSlug } from "~/utils/strings";
import { isNotEquals } from "~/utils/validations";
import type { T_ReactElement } from "~/types";

import { ROUTINE_ITEMS_STATUS, ROUTINE_STATUS, TIMER_STATUS } from "./constants";
import { Timer, Stats, RoutineItem } from "./components";
import { TimerPageContext } from "./context";
import type {
	T_RoutineStats,
	T_Routine,
	T_RoutineItem,
	T_TimerStatus,
	T_RoutinesTemplatesResponse,
} from "./types";

function TimerPage(): T_ReactElement {
	const {
		// states
		currentRoutine,
		currentRoutineItem,
		currentRoutineItemIndex,
		timerStatus,
		routinesHistory,

		// states setters
		setTimerStatus,

		// handlers
		handleInitRoutineClick,
		handleCompleteRoutineClick,
		handleCancelRoutineClick,
		handleUploadRoutineHistoryClick,
		handleDeleteRoutineHistoryClick,

		// vars
		routineItemsStartTime,
		routinesTemplates,
		isLoading,
		error,

		// utils
		timeToSeconds,
		secondsToTime,
		getStats,
		markRoutineItemAsCompleted,
		calculateRoutineItemTotalTime,
		setRoutineItemAsStarted,
		updateRoutineItem,
	} = useController();

	return (
		<Page
			config={{
				title: "Timer",
				disableSEO: true,
				scripts: [
					{
						element: "link",
						props: {
							rel: "preload",
							as: "audio",
							href: "/static/sounds/timer/set-completed.mp3",
						},
					},
					{
						element: "link",
						props: {
							rel: "preload",
							as: "audio",
							href: "/static/sounds/timer/routine-item-completed.mp3",
						},
					},
					{
						element: "link",
						props: {
							rel: "preload",
							as: "audio",
							href: "/static/sounds/timer/clock-tick.mp3",
						},
					},
				],
			}}
		>
			<Render
				isLoading={isLoading}
				error={error}
				data={routinesTemplates}
			>
				{() => {
					return currentRoutine ? (
						<TimerPageContext.Provider
							value={{
								// states
								currentRoutine,
								timerStatus,

								// states setters
								setTimerStatus,

								// utils
								timeToSeconds,
								secondsToTime,
								calculateRoutineItemTotalTime,
								setRoutineItemAsStarted,
								markRoutineItemAsCompleted,
								updateRoutineItem,
							}}
						>
							<Block className="tw-relative tw-mx-auto tw-min-h-screen tw-max-w-sm tw-pt-8 tw-shadow-md tw-shadow-gray-600 dfr-bg-color-light-strong">
								<GoBack
									className="tw-absolute tw-top-0"
									withConfirmation
								/>

								{currentRoutine.status === ROUTINE_STATUS.IN_PROGRESS ? (
									<React.Fragment>
										{currentRoutineItem && (
											<Timer
												routineItem={currentRoutineItem}
												routineItemIndex={currentRoutineItemIndex}
												routineItemsStartTime={routineItemsStartTime}
											/>
										)}

										<Block className="tw-p-2">
											<Block className="tw-flex tw-justify-between">
												<Button
													variant={Button.variant.SIMPLE}
													className="tw-text-sm"
													onClick={handleCancelRoutineClick}
												>
													<Icon
														icon={Icon.icon.X}
														color="dfr-text-colorful-secondary-100"
													/>
													<InlineText className="tw-ml-1 tw-align-middle">
														Cancelar rutina
													</InlineText>
												</Button>
												<Button
													variant={Button.variant.SIMPLE}
													className="tw-text-sm"
													onClick={handleCompleteRoutineClick}
												>
													<Icon icon={Icon.icon.CHECK} />
													<InlineText className="tw-ml-1 tw-align-middle">
														Completar rutina
													</InlineText>
												</Button>
											</Block>
											<Space size={1} />

											<Stats
												data={getStats(currentRoutine)}
												name={currentRoutine.name}
												startTime={currentRoutine.startTime}
											/>
											<Space
												size={4}
												variant={Space.variant.DASHED}
											/>

											<Block>
												{currentRoutine.items.map((routineItem) => {
													return (
														<RoutineItem
															key={routineItem.id}
															{...routineItem}
														/>
													);
												})}
											</Block>
										</Block>
									</React.Fragment>
								) : (
									<Block
										is="section"
										className="tw-p-8"
									>
										<Block>
											<Title
												is="h2"
												size={Title.size.MD}
												className="tw-text-center"
											>
												Elige una rutina
											</Title>
											<Space size={2} />
											{routinesTemplates.routines.map((routineTemplate) => {
												return (
													<Block
														key={routineTemplate.id}
														className="tw-my-1 tw-flex tw-items-start tw-justify-between"
													>
														<Text>- {routineTemplate.name}</Text>
														<Button
															variant={Button.variant.SIMPLE}
															className="tw-ml-2 tw-flex-shrink-0 tw-font-bold tw-underline"
															onClick={handleInitRoutineClick(routineTemplate)}
														>
															Iniciar rutina
														</Button>
													</Block>
												);
											})}
										</Block>
										<Space
											size={10}
											variant={Space.variant.DASHED}
										/>

										{routinesHistory.length > 0 ? (
											<React.Fragment>
												<Block is="section">
													<Title
														is="h2"
														size={Title.size.MD}
														className="tw-text-center"
													>
														Historial de rutinas
													</Title>
													<Space size={2} />
													{routinesHistory.map(({ date, routine }) => {
														return (
															<React.Fragment key={generateSlug(date)}>
																<Stats
																	title={date}
																	data={getStats(routine)}
																	name={routine.name}
																	startTime={routine.startTime}
																	endTime={routine.endTime}
																	uploadRoutineHandler={handleUploadRoutineHistoryClick(
																		date,
																		routine,
																	)}
																	deleteRoutineHandler={handleDeleteRoutineHistoryClick(date)}
																/>
																<Space size={1} />
															</React.Fragment>
														);
													})}
												</Block>
												<Space
													size={10}
													variant={Space.variant.DASHED}
												/>
											</React.Fragment>
										) : null}

										<Title
											is="h2"
											size={Title.size.MD}
											className="tw-text-center"
										>
											Ajustes
										</Title>
										<Space size={2} />
										<Block>
											<Button
												variant={Button.variant.SIMPLE}
												className="tw-mx-auto tw-block tw-text-center tw-font-bold tw-underline"
												onClick={() => {
													if (window.confirm("¿Está seguro?")) {
														window.localStorage.removeItem("DFR_TIMER");
														window.location.reload();
													}
												}}
											>
												Limpiar caché
											</Button>
											<Space size={1} />
											<Button
												variant={Button.variant.SIMPLE}
												className="tw-mx-auto tw-block tw-text-center tw-font-bold tw-underline"
												onClick={() => {
													window.location.reload();
												}}
											>
												Recargar app
											</Button>
										</Block>
									</Block>
								)}
							</Block>
						</TimerPageContext.Provider>
					) : null;
				}}
			</Render>

			<style jsx>{`
				:global(body) {
					background-color: black;
				}
			`}</style>
		</Page>
	);
}

export default withAuth(TimerPage);

// --- Controller ---

function useController() {
	// hooks
	const { theme, setTheme } = useTheme();
	const {
		data: routinesTemplates,
		isLoading,
		error,
	} = useQuery(
		"timer",
		async () => {
			await delay(1000);

			try {
				const { data } = await http.post(
					`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`,
					{
						path: "/timer",
						method: "GET",
					},
				);

				return data;
			} catch (error) {
				const routinesTemplates = readRoutineFromLocalStorage()["TEMPLATES"];

				if (routinesTemplates) {
					alert("Routines templates loaded from localStorage");
				} else {
					throw new Error("Routines templates not found in localStorage neither Firebase");
				}

				return routinesTemplates;
			}
		},
		{
			onSuccess: (routinesTemplates: T_RoutinesTemplatesResponse) => {
				saveDataInLocalStorage({ data: routinesTemplates, key: "TEMPLATES" });

				const loadedRoutine = loadRoutine(
					createNewRoutine(routinesTemplates.routines[0], routinesTemplates),
				);

				setCurrentRoutine(loadedRoutine);
				setRoutinesHistory(fetchRoutinesHistory());

				if (loadedRoutine.status !== ROUTINE_STATUS.COMPLETED) {
					findAndLoadRoutineItem(loadedRoutine);
				}
			},
		},
	);

	// states
	const [currentRoutine, setCurrentRoutine] = React.useState<T_Routine>();
	const [currentRoutineItem, setCurrentRoutineItem] = React.useState<T_RoutineItem>();
	const [currentRoutineItemIndex, setCurrentRoutineItemIndex] = React.useState<number>(0);
	const [timerStatus, setTimerStatus] = React.useState<T_TimerStatus>(TIMER_STATUS.NOT_STARTED);
	const [routinesHistory, setRoutinesHistory] = React.useState<
		{ date: string; routine: T_Routine }[]
	>([]);

	// utils
	const timeToSeconds = React.useCallback(function timeToSeconds(time?: string): number {
		if (!time || time.split(":").length === 0) return 0;

		const [hours, minutes, seconds] = time.split(":").map(Number);

		if (minutes === undefined && seconds === undefined) {
			return hours;
		}

		if (seconds === undefined) {
			return hours * 60 + minutes;
		}

		return hours * 60 * 60 + minutes * 60 + seconds + seconds;
	}, []);

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

	function addLeftPadding(number: number): string {
		return `${number < 10 ? "0" : ""}${number}`;
	}

	const calculateRoutineItemTotalTime = React.useCallback(
		function calculateRoutineItemTotalTime(
			sets: T_RoutineItem["sets"],
			highTime: T_RoutineItem["highTime"],
			restTime: T_RoutineItem["restTime"],
		): number {
			if (Array.isArray(sets)) {
				return (
					sets.reduce((result, curr) => {
						return result + timeToSeconds(curr);
					}, 0) +
					timeToSeconds(restTime) * (sets.length - 1)
				);
			}

			return timeToSeconds(highTime) * sets + timeToSeconds(restTime) * (sets - 1);
		},
		[timeToSeconds],
	);

	function setRoutineItemAsStarted(routine: T_Routine, routineItemId: T_RoutineItem["id"]) {
		setScrollPosition(0);

		let routineUpdated = updateRoutine(routine, routineItemId, {
			status: ROUTINE_ITEMS_STATUS.IN_PROGRESS,
		});

		if (currentRoutineItem?.status === ROUTINE_ITEMS_STATUS.IN_PROGRESS) {
			routineUpdated = updateRoutine(routineUpdated, currentRoutineItem?.id || "", {
				status: ROUTINE_ITEMS_STATUS.NOT_STARTED,
			});
		}

		const routineItemFoundIndex = routineUpdated.items.findIndex(
			(item) => item.id === routineItemId,
		);

		setCurrentRoutine(routineUpdated);
		setCurrentRoutineItem(routineUpdated.items[routineItemFoundIndex]);
		setCurrentRoutineItemIndex(routineItemFoundIndex);
	}

	function markRoutineItemAsCompleted(currentRoutine, routineItemId, routineItemStatus, option) {
		const routineUpdated = updateRoutine(currentRoutine, routineItemId, {
			status:
				routineItemStatus === ROUTINE_ITEMS_STATUS.COMPLETED
					? ROUTINE_ITEMS_STATUS.NOT_STARTED
					: ROUTINE_ITEMS_STATUS.COMPLETED,
		});
		setCurrentRoutine(routineUpdated);

		if (
			routineItemStatus === ROUTINE_ITEMS_STATUS.IN_PROGRESS &&
			option === "SEARCH_FOR_NEXT_ROUTINE_ITEM"
		) {
			setScrollPosition(0);
			searchForNextNotStartedRoutineItem(routineUpdated);
		} else {
			setCurrentRoutineItem(routineUpdated.items[currentRoutineItemIndex]);
		}
	}

	function updateRoutineItem(
		routine: T_Routine,
		routineItemId: T_RoutineItem["id"],
		payload: Partial<T_RoutineItem>,
	) {
		const routineUpdated = updateRoutine(routine, routineItemId, payload);
		const routineItemUpdatedIndex = routineUpdated.items.findIndex(
			(item) => item.id === routineItemId,
		);

		setCurrentRoutine(routineUpdated);
		setCurrentRoutineItem(routineUpdated.items[routineItemUpdatedIndex]);
		setCurrentRoutineItemIndex(routineItemUpdatedIndex);
	}

	// private
	const createFormattedDate = React.useCallback(function createFormattedDate() {
		const date = new Date();
		return `${date.getFullYear()}/${addLeftPadding(date.getMonth() + 1)}/${addLeftPadding(date.getDate())}`;
	}, []);

	const updateRoutine = React.useCallback(function updateRoutine(
		routine: T_Routine,
		routineItemId: T_RoutineItem["id"],
		payload: Partial<T_RoutineItem>,
	): T_Routine {
		const routineUpdated = {
			...routine,
			items: routine.items.map((item) => {
				if (item.id === routineItemId) {
					return {
						...item,
						...payload,
					};
				}

				return item;
			}),
		};

		return routineUpdated;
	},
	[]);

	function searchForNextNotStartedRoutineItem(routine: T_Routine) {
		const routineItemFound =
			routine.items
				.slice(currentRoutineItemIndex)
				.find((item) => item.status === ROUTINE_ITEMS_STATUS.NOT_STARTED) ||
			routine.items
				.slice(0, currentRoutineItemIndex)
				.find((item) => item.status === ROUTINE_ITEMS_STATUS.NOT_STARTED);

		if (routineItemFound) {
			const routineUpdated = updateRoutine(routine, routineItemFound.id, {
				status: ROUTINE_ITEMS_STATUS.IN_PROGRESS,
			});
			const routineItemFoundIndex = routineUpdated.items.findIndex(
				(item) => item.id === routineItemFound.id,
			);

			setCurrentRoutine(routineUpdated);
			setCurrentRoutineItem(routineUpdated.items[routineItemFoundIndex]);
			setCurrentRoutineItemIndex(routineItemFoundIndex);
		} else {
			markRoutineAsCompleted(routine);
		}
	}

	const saveDataInLocalStorage = React.useCallback(
		function saveDataInLocalStorage({
			key = createFormattedDate(),
			data,
		}: {
			data?: T_RoutinesTemplatesResponse | T_Routine;
			key?: string;
		}) {
			const loadedRoutine = readRoutineFromLocalStorage();

			window.localStorage.setItem(
				"DFR_TIMER",
				JSON.stringify({
					...loadedRoutine,
					[key]: data,
				}),
			);
		},
		[createFormattedDate],
	);

	function loadRoutine(defaultRoutine: T_Routine, key?: string): T_Routine {
		const loadedRoutine =
			readRoutineFromLocalStorage()[key || createFormattedDate()] || defaultRoutine;

		return loadedRoutine;
	}

	function readRoutineFromLocalStorage() {
		try {
			return JSON.parse((window.localStorage.getItem("DFR_TIMER") || "") as string);
		} catch (error) {
			console.error(error);
			return {};
		}
	}

	const getStats = React.useCallback(
		function getStats(routine?: T_Routine): T_RoutineStats {
			if (!routine) {
				return {
					totalExercises: 0,
					totalCompletedExercises: 0,
					completedPercent: "",
					completedTime: "",
					totalTime: "",
					finalRoutineDuration: "",
					remainingTime: "",
				};
			}

			const totalExercises = Object.keys(routine.items).length;
			const completedExercises = routine.items.filter((item) => {
				return item.status === ROUTINE_ITEMS_STATUS.COMPLETED;
			});
			const remainingItems = routine.items
				.filter((item) => item.status !== ROUTINE_ITEMS_STATUS.COMPLETED)
				.map((item) => {
					return calculateRoutineItemTotalTime(item.sets, item.highTime, item.restTime);
				});
			const isRoutineCompleted = completedExercises.length === totalExercises;

			return {
				totalExercises,
				totalCompletedExercises: completedExercises.length,
				completedPercent: `${Math.round((completedExercises.length / totalExercises) * 100)}%`,
				completedTime: secondsToTime(
					completedExercises.length > 0
						? completedExercises
								.map((item) => {
									return calculateRoutineItemTotalTime(item.sets, item.highTime, item.restTime);
								})
								.reduce((result, curr) => result + curr, 0) +
								timeToSeconds(routine.restTimeBetweenItems) *
									(completedExercises.length - (isRoutineCompleted ? 1 : 0))
						: 0,
				),
				totalTime: secondsToTime(
					routine.items
						.map((item) => {
							return calculateRoutineItemTotalTime(item.sets, item.highTime, item.restTime);
						})
						.reduce((result, curr) => result + curr, 0) +
						timeToSeconds(routine.restTimeBetweenItems) * (totalExercises - 1),
				),
				finalRoutineDuration: routine.endTime
					? secondsToTime(Math.ceil(Math.abs((routine.endTime.ms - routine.startTime.ms) / 1000)))
					: "",
				remainingTime: secondsToTime(
					remainingItems.reduce((result, curr) => result + curr, 0) +
						timeToSeconds(routine.restTimeBetweenItems) * (remainingItems.length - 1),
				),
			};
		},
		[timeToSeconds, secondsToTime, calculateRoutineItemTotalTime],
	);

	function findAndLoadRoutineItem(routine: T_Routine) {
		const routineItemIndexInProgress = routine.items.findIndex(
			(item) => item.status === ROUTINE_ITEMS_STATUS.IN_PROGRESS,
		);
		const routineItemIndexNotStarted = routine.items.findIndex(
			(item) => item.status === ROUTINE_ITEMS_STATUS.NOT_STARTED,
		);
		const routineItemToLoadIndex =
			routineItemIndexInProgress !== -1
				? routineItemIndexInProgress
				: routineItemIndexNotStarted !== -1
				? routineItemIndexNotStarted
				: -1;

		if (routineItemToLoadIndex === -1) {
			throw new Error("This routine does not have items or already was completed");
		}

		setCurrentRoutineItem(routine.items[routineItemToLoadIndex]);
		setCurrentRoutineItemIndex(routineItemToLoadIndex);
		setCurrentRoutine(
			updateRoutine(routine, routine.items[routineItemToLoadIndex].id, {
				status: ROUTINE_ITEMS_STATUS.IN_PROGRESS,
			}),
		);
	}

	function isRoutineCompleted(routine: T_Routine): boolean {
		return (
			routine.items.filter((item) => {
				return item.status === ROUTINE_ITEMS_STATUS.COMPLETED;
			}).length === routine.items.length
		);
	}

	const markRoutineAsCompleted = React.useCallback(
		function markRoutineAsCompleted(routine?: T_Routine) {
			const routineUpdated = {
				...routine,
				endTime: {
					ms: new Date().getTime(),
					formatted: new Date().toLocaleTimeString(),
				},
				status: ROUTINE_STATUS.COMPLETED,
			} as T_Routine;

			setTimerStatus(TIMER_STATUS.NOT_STARTED);
			setCurrentRoutine({ ...routineUpdated, stats: getStats(routineUpdated) });
			alert("La rutina ha sido completada!");
		},
		[getStats],
	);

	const setAtLeastOneRoutineItemAsInProgress = React.useCallback(
		function setAtLeastOneRoutineItemAsInProgress(routine: T_Routine) {
			const allRoutineItemsStatusIsNotStarted =
				routine.items.filter((item) => item.status === ROUTINE_ITEMS_STATUS.NOT_STARTED).length ===
				routine.items.length;

			if (allRoutineItemsStatusIsNotStarted) {
				const routineUpdated = updateRoutine(routine, routine.items[0].id, {
					status: ROUTINE_ITEMS_STATUS.IN_PROGRESS,
				});

				setCurrentRoutineItem(routineUpdated.items[0]);
				setCurrentRoutineItemIndex(0);
				setCurrentRoutine(routineUpdated);
			}
		},
		[updateRoutine],
	);

	const fetchRoutinesHistory = React.useCallback(function fetchRoutinesHistory() {
		return Object.entries(readRoutineFromLocalStorage())
			.reduce((result, [date, routine]: [string, T_Routine]) => {
				if (routine.status !== ROUTINE_STATUS.COMPLETED) return result;

				return [...result, { date, routine }];
			}, [])
			.sort(sortBy([{ param: "date", order: "desc" }]));
	}, []);

	const createNewRoutine = React.useCallback(function createNewRoutine(
		routine: T_Routine,
		routinesTemplates: T_RoutinesTemplatesResponse,
	): T_Routine {
		return {
			...routine,
			status: ROUTINE_STATUS.NOT_STARTED,
			startTime: {
				ms: new Date().getTime(),
				formatted: new Date().toLocaleTimeString(),
			},
			items: (isDevelopmentEnvironment()
				? (
						[
							{
								id: "tests",
								title: "tests",
								highTime: "00:03",
								sets: 2,
								restTime: "00:02",
								status: ROUTINE_ITEMS_STATUS.NOT_STARTED,
							},
						] as T_RoutineItem[]
				  ).concat(routine.items.slice(0, 5))
				: routine.items
			).map((item) => {
				if (typeof item === "string") {
					return {
						...routinesTemplates.exercises[item],
						status: ROUTINE_ITEMS_STATUS.NOT_STARTED,
					};
				}

				return {
					...item,
					status: ROUTINE_ITEMS_STATUS.NOT_STARTED,
				};
			}),
		};
	},
	[]);

	// handlers
	function handleInitRoutineClick(routineTemplate: T_Routine) {
		return () => {
			const loadedRoutineFromLocalStorage = readRoutineFromLocalStorage()[createFormattedDate()];

			const thisRoutineWasCompletedPreviously =
				loadedRoutineFromLocalStorage?.status === ROUTINE_STATUS.COMPLETED;

			if (thisRoutineWasCompletedPreviously) {
				const userCanceledRoutineRestarting = !window.confirm(
					"Una rutina ya fue completada el día de hoy. ¿Está seguro que quiere iniciar una nueva rutina y sobre-escribir los datos de la rutina existente?",
				);

				if (userCanceledRoutineRestarting) return;

				const newRoutine = {
					...createNewRoutine(routineTemplate, routinesTemplates),
					status: ROUTINE_STATUS.IN_PROGRESS,
				};
				setCurrentRoutine(newRoutine);
				findAndLoadRoutineItem(newRoutine);
			} else {
				setCurrentRoutine({
					...createNewRoutine(routineTemplate, routinesTemplates),
					status: ROUTINE_STATUS.IN_PROGRESS,
				});
			}
		};
	}

	const handleCompleteRoutineClick = React.useCallback(
		function handleCompleteRoutineClick() {
			if (window.confirm("¿Está seguro que quiere completar la rutina? Hay items sin terminar")) {
				markRoutineAsCompleted(currentRoutine as T_Routine);
			}
		},
		[markRoutineAsCompleted, currentRoutine],
	);

	const handleCancelRoutineClick = React.useCallback(
		function handleCancelRoutineClick() {
			if (window.confirm("¿Está seguro que quiere cancelar la rutina?")) {
				saveDataInLocalStorage({ data: undefined });
				setCurrentRoutine(createNewRoutine(routinesTemplates.routines[0], routinesTemplates));
				setTimerStatus(TIMER_STATUS.NOT_STARTED);
			}
		},
		[setCurrentRoutine, saveDataInLocalStorage, routinesTemplates, createNewRoutine],
	);

	const handleUploadRoutineHistoryClick = React.useCallback(
		function handleUploadRoutineHistoryClick(date, routine) {
			return async () => {
				try {
					await http.post(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
						path: "/timer",
						method: "POST",
						payload: {
							date,
							routine,
						},
					});

					alert("La rutina fue guardada correctamente");
				} catch (error) {
					console.error(error);
					alert(error.message);
				}
			};
		},
		[],
	);

	const handleDeleteRoutineHistoryClick = React.useCallback(
		function handleDeleteRoutineHistoryClick(date) {
			return async () => {
				try {
					if (window.confirm("¿Está seguro?")) {
						saveDataInLocalStorage({ data: undefined, key: date });
						setRoutinesHistory(fetchRoutinesHistory());
					}
				} catch (error) {
					console.error(error);
					alert(error.message);
				}
			};
		},
		[saveDataInLocalStorage, fetchRoutinesHistory],
	);

	// effects
	useDidMount(() => {
		if (theme === "dark") setTheme("light");
	});

	React.useEffect(
		function onRoutineChange() {
			if (!currentRoutine) return;

			saveDataInLocalStorage({ data: currentRoutine });
			setRoutinesHistory(fetchRoutinesHistory());

			if (
				isRoutineCompleted(currentRoutine) &&
				isNotEquals(currentRoutine.status, ROUTINE_STATUS.COMPLETED)
			) {
				markRoutineAsCompleted(currentRoutine);
			} else {
				setAtLeastOneRoutineItemAsInProgress(currentRoutine);
			}
		},
		[
			currentRoutine,
			currentRoutineItem,
			currentRoutineItemIndex,
			timerStatus,

			markRoutineAsCompleted,
			saveDataInLocalStorage,
			updateRoutine,
			setAtLeastOneRoutineItemAsInProgress,
			fetchRoutinesHistory,
		],
	);

	return {
		// states
		currentRoutine,
		currentRoutineItem,
		currentRoutineItemIndex,
		timerStatus,
		routinesHistory,

		// states setters
		setTimerStatus,

		// handlers
		handleInitRoutineClick,
		handleCompleteRoutineClick,
		handleCancelRoutineClick,
		handleUploadRoutineHistoryClick,
		handleDeleteRoutineHistoryClick,

		// vars
		routinesTemplates,
		isLoading,
		error,
		routineItemsStartTime: routinesTemplates?.metadata.routineItemsStartTime || 0,

		// utils
		timeToSeconds,
		secondsToTime,
		getStats,
		markRoutineItemAsCompleted,
		calculateRoutineItemTotalTime,
		setRoutineItemAsStarted,
		updateRoutineItem,
	};
}
