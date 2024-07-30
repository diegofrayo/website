import * as React from "react";
import jsConvertCase from "js-convert-case";
import dayjs from "dayjs";

import { Page } from "~/components/layout";
import {
	Block,
	Button,
	Collapsible,
	Icon,
	InlineText,
	Input,
	Link,
	List,
	Select,
	Space,
	Text,
	Title,
} from "~/components/primitive";
import { CopyToClipboardPopover } from "~/components/shared";
import BUILD_INFO from "~/data/build-info.json";
import cn from "~/lib/cn";
import http from "~/lib/http";
import { ComponentWithAuth } from "~/modules/auth";
import { logger } from "~/modules/logging";
import { ROUTES } from "~/modules/routing";
import { useDidMount } from "@diegofrayo/hooks";
import { sortBy } from "@diegofrayo/sort";
import type DR from "@diegofrayo/types";
import { createArray } from "@diegofrayo/utils/arrays-and-objects";
import { goToElement } from "@diegofrayo/utils/browser";
import { dateWithoutTime } from "@diegofrayo/utils/dates";
import { delay } from "@diegofrayo/utils/misc";
import { addLeftPadding, generateSlug, replaceAll } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";

import type {
	T_DayOfMatches,
	T_FixtureMatch,
	T_League,
	T_LeagueStandings,
	T_MarketPrediction,
	T_PlayedMatch,
} from "./types";
import styles from "./styles.module.css";

// import DATA from "../../../../../../public/data/apps/bets/2024-07-29.json"; // NOTE: FOR DX PURPOSES

function BetsPage() {
	// --- STATES & REFS ---
	const [renderType] = React.useState<"MARKET" | "DATE">("DATE");
	const [selectedDate, setSelectedDate] = React.useState(formatDate(new Date()));
	const [isLoading, setIsLoading] = React.useState(true);
	const [data, setData] = React.useState<undefined | T_Data>(undefined);
	// const [data, setData] = React.useState<T_Data>({ [selectedDate]: DATA as T_DayOfMatches }); // NOTE: FOR DX PURPOSES

	// --- EFFECTS ---
	useDidMount(() => {
		fetchData(selectedDate);
	});

	// --- HANDLERS ---
	function handleInputDateChange(event: DR.React.Events.OnChangeEvent) {
		if (event.currentTarget.value === selectedDate || !event.currentTarget.value) return;

		setSelectedDate(event.currentTarget.value);
		fetchData(event.currentTarget.value);
	}

	// --- HANDLERS ---
	async function fetchData(selectedDate_: string) {
		try {
			// return; // NOTE: FOR DX PURPOSES

			setIsLoading(true);
			await delay(1000);

			const dates = generateDates(selectedDate_);
			const newData = (
				await Promise.all(
					dates.map(async (date) => {
						/*
						// TODO: Solve typing error using safeAsync
						const [response] = await safeAsync(() => {
							return http.get<T_DayOfMatches>(
								`/data/apps/bets/${date}.json?v=${BUILD_INFO.timestamp}`,
							);
						});
            */

						let response;
						try {
							response = await http.get<T_DayOfMatches>(
								`/data/apps/bets/${date}.json?v=${BUILD_INFO.timestamp}`,
							);
						} catch (e) {
							logger("LOG", e);
						}

						return { date, data: response ? response.data.sort(sortBy("priority")) : [] };
					}),
				)
			).reduce((result, item) => {
				return {
					...result,
					[item.date]: item.data,
				};
			}, {});

			setData(newData);
		} catch (error) {
			console.log(error);
			setData(undefined);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Page
			config={{
				title: "Bets",
				disableSEO: true,
			}}
		>
			<Layout>
				<Block
					is="header"
					className="tw-border-b tw-border-stone-800"
				>
					<Block className="tw-relative tw-mx-auto tw-max-w-[1280px] tw-p-4">
						<Title
							is="h1"
							className="tw-text-2xl tw-text-white dr-font-main-title"
						>
							<Icon
								icon={Icon.icon.TROPHY_SOLID}
								wrapperClassName="tw-align-middle tw-mr-2"
								size={26}
							/>
							<InlineText className="tw-align-middle">BETS</InlineText>
						</Title>
						<Link
							href={ROUTES.HOME}
							className="tw-absolute tw-right-1 tw-top-1"
						>
							<Icon
								icon={Icon.icon.EXIT}
								size={20}
								iconClassName="tw-text-stone-300"
							/>
						</Link>
					</Block>
				</Block>

				<Block className="tw-mx-auto tw-max-w-[1280px] tw-px-1 tw-py-8 md:tw-px-4">
					<Block className="tw-text-white">
						<Text className="tw-text-sm tw-font-bold">Seleccionar fecha:</Text>
						<Space size={1} />
						<Input
							type="date"
							id="input-dates-selector"
							className={cn(
								styles["input-date"],
								"tw-flex tw-h-[60px] tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-stone-800 tw-bg-black tw-px-4 tw-py-0 tw-text-center",
							)}
							containerProps={{ className: "tw-w-[300px] tw-block tw-max-w-full" }}
							value={selectedDate}
							onChange={handleInputDateChange}
						/>
					</Block>
					<Space
						size={10}
						variant={Space.variant.SIMPLE}
					/>

					{isLoading ? (
						<Block className="tw-fixed tw-right-0 tw-top-16 tw-flex tw-h-screen tw-w-screen tw-items-center tw-justify-center tw-backdrop-blur">
							<Block
								is="span"
								className="tw-inline-block tw-animate-spin tw-rounded-full tw-border-x-2 tw-border-y tw-border-stone-500 tw-wh-16"
							/>
						</Block>
					) : data ? (
						renderType === "MARKET" ? null : (
							<RenderByDate
								data={data}
								selectedDate={selectedDate}
							/>
						)
					) : (
						<Block className="tw-text-red-500">Error!</Block>
					)}
				</Block>
			</Layout>
		</Page>
	);
}

export default BetsPage;

// --- COMPONENTS ---

function Layout({ children }: { children: DR.React.Children }) {
	return (
		<Block
			is="main"
			className="tw-min-h-screen tw-bg-black tw-text-sm tw-text-stone-300 lg:tw-text-base"
		>
			{children}
		</Block>
	);
}

function RenderByDate({ data, selectedDate }: { data: T_Data; selectedDate: string }) {
	// --- VARS ---
	const selectedDateIsToday = formatDate(new Date()) === selectedDate;

	return (
		<Block>
			{Object.entries(data).map(([fixtureDate, fixtureLeagues]) => {
				return (
					<Collapsible
						key={fixtureDate}
						title={
							<Block>
								<Text className="tw-text-lg tw-font-bold tw-text-white">
									Partidos {selectedDateIsToday ? getRelativeDatesDifference(fixtureDate) : ""}
								</Text>
								<Text>{localizeDate(fixtureDate)}</Text>
							</Block>
						}
						className="tw-mb-8 last:tw-mb-0"
						contentClassName="tw-py-6"
						showIcon={false}
					>
						{fixtureLeagues.length === 0 ? (
							<Text>No hay partidos para esta fecha</Text>
						) : (
							fixtureLeagues.map((league) => {
								return (
									<LeagueFixture
										key={`${fixtureDate}-${league.name}`}
										league={league}
										fixtureDate={fixtureDate}
									/>
								);
							})
						)}
					</Collapsible>
				);
			})}
		</Block>
	);
}

function LeagueFixture({
	league,
	fixtureDate,
}: {
	league: T_DayOfMatches[number];
	fixtureDate: string;
}) {
	// --- STATES & VARS ---
	const [selectedMatch, setSelectedMatch] = React.useState<undefined | T_FixtureMatch>(undefined);

	// --- HANDLERS ---
	async function onOpenMatchDetailsHandler(match: T_FixtureMatch) {
		setSelectedMatch(match);
		goToElement(`${fixtureDate}-${league.id}`);
	}

	// --- UTILS ---
	function groupMatchesByDate(matches: T_FixtureMatch[]) {
		return matches.reduce(
			(result, match) => {
				const resultUpdated = { ...result };
				const matchDate = match.date;

				if (!resultUpdated[matchDate]) {
					resultUpdated[matchDate] = [];
				}

				resultUpdated[matchDate].push(match);

				return resultUpdated;
			},
			{} as DR.Object<T_FixtureMatch[]>,
		);
	}

	return (
		<Collapsible
			title={
				<Title
					is="h2"
					id={`${fixtureDate}-${league.id}`}
					className="tw-relative tw-flex tw-items-center tw-justify-start md:tw-max-w-[500px]"
				>
					<Block
						is="span"
						className="tw-mr-2 tw-inline-flex tw-flex-shrink-0 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-stone-800 tw-wh-8"
					>
						<Block
							is="span"
							className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-stone-500 tw-p-0.5 tw-text-xl tw-leading-none tw-wh-7"
						>
							{league.flag}
						</Block>
					</Block>
					<Block className="tw-inline-block">
						<InlineText className="tw-truncate tw-text-base tw-text-gray-100">
							{league.name}
						</InlineText>

						<InlineText className="win:tw-inline tw-ml-1 tw-hidden tw-truncate tw-text-base tw-text-gray-100">
							({league.country})
						</InlineText>
					</Block>

					<Link
						variant={Link.variant.SIMPLE}
						href={`https://www.google.com/search?q=${encodeURIComponent(
							`${league.name} 365scores`,
						)}`}
						className="tw-absolute tw-right-0 tw-top-0"
						isExternalLink
					>
						<Icon
							icon={Icon.icon.EXTERNAL_LINK}
							size={12}
						/>
					</Link>
				</Title>
			}
			showIcon={false}
			contentClassName="tw-border-l-0 tw-my-4 tw-mx-0 tw-px-0 md:tw-px-4 md:tw-border-l-4 md:tw-m-4 tw-border-stone-500"
			className="tw-mb-6 last:tw-mb-0"
		>
			<LeagueStandings
				topKey={fixtureDate}
				data={league.standings}
			/>
			{league.standings.length > 0 ? <Space size={1} /> : null}

			{selectedMatch ? (
				<Block className="tw-mb-4 tw-border tw-border-yellow-500">
					<FixtureMatch
						// variant="date"
						key={selectedMatch.id}
						topKey={league.name}
						match={selectedMatch}
						league={league}
						onOpenMatchDetailsHandler={onOpenMatchDetailsHandler}
						isSelectedMatch
					/>
				</Block>
			) : null}

			{Object.entries(groupMatchesByDate(league.matches)).map(([date, matchesGroupedByDate]) => {
				return (
					<Block
						key={`${league.name}-${date}`}
						className={cn(
							"tw-flex tw-flex-wrap tw-gap-4",
							matchesGroupedByDate.length > 2 ? "tw-justify-stretch" : "tw-justify-start",
						)}
					>
						{matchesGroupedByDate.map((match) => {
							if (match.id === selectedMatch?.id) {
								return null;
							}

							return (
								<Block
									key={match.id}
									className="tw-w-full md:tw-w-96"
								>
									<FixtureMatch
										// variant="date"
										topKey={date}
										match={match}
										league={league}
										onOpenMatchDetailsHandler={onOpenMatchDetailsHandler}
									/>
								</Block>
							);
						})}
					</Block>
				);
			})}
		</Collapsible>
	);
}

function FixtureMatch({
	// variant,
	topKey,
	match,
	league,
	isSelectedMatch,
	onOpenMatchDetailsHandler,
}: {
	// variant: "DATE" | "MARKET";
	topKey: string;
	match: T_FixtureMatch;
	league: Pick<T_League, "country" | "name">;
	isSelectedMatch?: boolean;
	onOpenMatchDetailsHandler: (match: T_FixtureMatch) => void;
}) {
	// --- STATES & REFS ---
	const [matchesFilters, setMatchesFilters] = React.useState<T_PlayedMatchesFilters>({});

	// --- HANDLERS ---
	function onMatchesFilterChange(teamName: string) {
		return function onMatchesFilterChangeInner(
			event: DR.React.Events.OnChangeEvent<HTMLSelectElement>,
		) {
			setMatchesFilters((currentValue) => {
				return {
					...currentValue,
					[teamName]: event.target.value as T_FiltersValues,
				};
			});
		};
	}

	function handleSelectMatchClick() {
		onOpenMatchDetailsHandler(match);
	}

	// --- UTILS ---
	function filterMatches(matches: T_PlayedMatch[], teamName: string, filter: T_FiltersValues) {
		if (filter === "Todos") {
			return matches;
		}

		if (filter === "Local") {
			return matches.filter((item) => {
				return item.teams.home.name === teamName;
			});
		}

		if (filter === "Visitante") {
			return matches.filter((item) => {
				return item.teams.away.name === teamName;
			});
		}

		if (filter === "Ganados") {
			return matches.filter((item) => {
				return (
					(item.teams.home.name === teamName && item.teams.home.winner === true) ||
					(item.teams.away.name === teamName && item.teams.away.winner === true)
				);
			});
		}

		if (filter === "Perdidos") {
			return matches.filter((item) => {
				return (
					(item.teams.home.name === teamName && item.teams.home.winner === false) ||
					(item.teams.away.name === teamName && item.teams.away.winner === false)
				);
			});
		}

		if (filter === "Empatados") {
			return matches.filter((item) => {
				return (
					(item.teams.home.name === teamName && item.teams.home.winner === null) ||
					(item.teams.away.name === teamName && item.teams.away.winner === null)
				);
			});
		}

		return matches;
	}

	if (isSelectedMatch) {
		return (
			<Collapsible
				id={match.id}
				title={
					<MatchDetails
						variant="DATE_FIXTURE_MATCH"
						match={match}
						className="tw-cursor-pointer"
					/>
				}
				className="tw-overflow-hidden tw-rounded-md"
				contentClassName="tw-bg-stone-900 tw-p-1 md:tw-p-4"
				showIcon={false}
				opened
			>
				<Collapsible
					title={<CollapsibleTitle title="Ver predicciones" />}
					contentClassName="tw-mt-1 tw-p-1 md:tw-p-4 tw-bg-stone-800 tw-font-mono"
					showIcon={false}
				>
					{match.predictions.map((marketPrediction) => {
						const baseKey = `${match.id}-${marketPrediction.id}`;

						return (
							<Collapsible
								key={baseKey}
								title={
									<Text className="tw-font-bold">
										<InlineText className="tw-mr-1 tw-inline-block tw-align-middle">
											{marketPrediction.name}{" "}
										</InlineText>
										<InlineText className="tw-inline-block tw-align-middle tw-text-xxs">
											{getMarketTrustLevelEmojy(marketPrediction.trustLevelLabel)}
										</InlineText>
									</Text>
								}
								showIcon={false}
								className="tw-mb-2 last:tw-mb-0"
								contentClassName="tw-p-1 tw-mb-4 md:tw-p-4 tw-bg-stone-900 tw-mt-1"
							>
								{marketPrediction.criteria.map((subCriteria, subCriteriaIndex) => {
									return (
										<Block
											key={`${baseKey}-${subCriteriaIndex}`}
											className="tw-mb-4 last:tw-mb-0"
										>
											<Text className="tw-font-bold">
												<InlineText className="tw-mr-1 tw-inline-block tw-align-middle">
													{subCriteria.description}
												</InlineText>
												<InlineText className="tw-inline-block tw-align-middle tw-text-xxs">
													{subCriteria.fulfilled ? "✅" : "❌"}
												</InlineText>
											</Text>

											<Block className="tw-pl-2">
												{subCriteria.items.map((item, itemIndex) => {
													return (
														<Collapsible
															key={`${baseKey}-${subCriteriaIndex}-${itemIndex}`}
															title={
																<Text>
																	<InlineText className="tw-mr-1 tw-inline tw-align-middle">
																		- {item.description}
																	</InlineText>
																	<InlineText className="tw-inline-block tw-align-middle tw-text-xxs">
																		{item.fulfilled ? "✅" : "❌"}
																	</InlineText>
																</Text>
															}
															showIcon={false}
														>
															<Text
																className={cn(
																	"tw-mb-2 tw-pl-5 tw-text-sm tw-italic",
																	item.fulfilled ? "tw-text-green-400" : "tw-text-red-400",
																)}
															>
																{item.explanation}
															</Text>
														</Collapsible>
													);
												})}
											</Block>
										</Block>
									);
								})}
							</Collapsible>
						);
					})}
				</Collapsible>
				<Space size={2} />

				<Block className="tw-flex tw-flex-wrap tw-items-start tw-justify-between tw-gap-1 tw-overflow-auto md:tw-gap-4 md:tw-overflow-hidden lg:tw-flex-nowrap">
					{Object.entries(match.teams).map(([teamSide, team]) => {
						const filteredMatches = filterMatches(
							team.matches,
							team.name,
							matchesFilters[team.name] || (teamSide === "home" ? "Local" : "Visitante"),
						);

						return (
							<Block
								key={team.name}
								className="tw-w-full tw-flex-shrink-0 tw-overflow-auto tw-rounded-sm tw-bg-stone-800 sm:tw-min-w-full lg:tw-w-1/2 lg:tw-min-w-0"
							>
								<Block className="tw-relative tw-flex tw-justify-between tw-bg-stone-700 tw-px-1 tw-py-1 md:tw-px-4">
									<Text className="tw-flex-1 tw-text-left">
										<InlineText className="tw-align-middle">{team.name}</InlineText>
									</Text>

									<Link
										variant={Link.variant.SIMPLE}
										href={`https://www.google.com/search?q=${encodeURIComponent(
											`${team.name} equipo ${league.country || ""} 365scores`,
										)}`}
										className="tw-absolute tw-right-1 tw-top-0"
										isExternalLink
									>
										<Icon
											icon={Icon.icon.EXTERNAL_LINK}
											size={12}
										/>
									</Link>
								</Block>

								<Block className="tw-p-1 md:tw-p-4">
									{team.position ? (
										<React.Fragment>
											<Text>
												<InlineText is="strong">Posición:</InlineText>{" "}
												<InlineText>{team.position}</InlineText>
											</Text>
											<Space size={1} />
										</React.Fragment>
									) : null}

									<Collapsible
										title={<CollapsibleTitle title="Ver estadísticas" />}
										contentClassName="tw-mt-2 tw-p-2 md:tw-p-4 tw-bg-stone-900 tw-mb-4"
										showIcon={false}
									>
										{Object.values(team.stats).map((group) => {
											const reactKey = generateSlug(`${match.id}-stats-${group.name}`);

											return (
												<Block
													key={reactKey}
													is="section"
													className="tw-mb-3 last:tw-mb-0"
												>
													<Text className="tw-text-lg tw-font-bold tw-uppercase tw-text-white">
														{group.name}
													</Text>
													<Space size={0.5} />

													<List
														variant={List.variant.SIMPLE}
														className="tw-ml-0 md:tw-ml-2"
													>
														{Object.entries(group.items).map(([key, value], index) => {
															return (
																<List.Item key={`${reactKey}-${index}`}>
																	<InlineText is="strong">
																		{jsConvertCase.toSentenceCase(key)}:
																	</InlineText>{" "}
																	<InlineText>
																		{value}
																		{key.includes("porcentaje") ? "%" : ""}
																	</InlineText>
																</List.Item>
															);
														})}
													</List>
												</Block>
											);
										})}
									</Collapsible>
									<Space size={1} />

									<Collapsible
										title={<CollapsibleTitle title="Ver historial de partidos" />}
										contentClassName="tw-pt-2 tw-px-0 md:tw-px-1 tw-pb-6"
										showIcon={false}
									>
										<Block>
											<Select
												id={generateSlug(`${topKey}-${match.id}-matches-filter-${teamSide}`)}
												variant={Select.variant.STYLED}
												defaultValue={teamSide === "home" ? "Local" : "Visitante"}
												onChange={onMatchesFilterChange(team.name)}
											>
												<Select.Option value="Todos">
													Todos{" "}
													{matchesFilters[team.name] === "Todos"
														? `(${filteredMatches.length})`
														: ""}
												</Select.Option>
												<Select.Option value="Local">
													Local{" "}
													{matchesFilters[team.name] === "Local" ||
													(!matchesFilters[team.name] && teamSide === "home")
														? `(${filteredMatches.length})`
														: ""}
												</Select.Option>
												<Select.Option value="Visitante">
													Visitante{" "}
													{matchesFilters[team.name] === "Visitante" ||
													(!matchesFilters[team.name] && teamSide === "away")
														? `(${filteredMatches.length})`
														: ""}
												</Select.Option>
												<Select.Option value="Ganados">
													Ganados{" "}
													{matchesFilters[team.name] === "Ganados"
														? `(${filteredMatches.length})`
														: ""}
												</Select.Option>
												<Select.Option value="Perdidos">
													Perdidos{" "}
													{matchesFilters[team.name] === "Perdidos"
														? `(${filteredMatches.length})`
														: ""}
												</Select.Option>
												<Select.Option value="Empatados">
													Empatados{" "}
													{matchesFilters[team.name] === "Empatados"
														? `(${filteredMatches.length})`
														: ""}
												</Select.Option>
											</Select>
										</Block>
										<Space size={1} />

										<Block className="tw-rounded-md tw-bg-stone-900 tw-px-4 tw-pb-4 tw-pt-6 md:tw-px-6 md:tw-pb-6 md:tw-pt-8">
											{filteredMatches.map((playedMatch, index) => {
												const currentTeam =
													playedMatch.teams.home.name === team.name
														? playedMatch.teams.home
														: playedMatch.teams.away;

												return (
													<Block
														key={`${generateSlug(playedMatch.id + playedMatch.hour + index)}`}
														className={cn(
															"tw-relative tw-mb-6 tw-rounded-sm tw-border-2 tw-px-4 tw-pb-9 tw-pt-6 last:tw-mb-0",
															currentTeam.winner === true
																? "tw-border-green-500"
																: currentTeam.winner === false
																	? "tw-border-red-500"
																	: "tw-border-yellow-500",
														)}
													>
														<Block
															className={cn(
																"tw-absolute tw--top-3 tw-left-0 tw-w-full tw-text-center",
															)}
														>
															<InlineText
																className={cn(
																	"tw-inline-block tw-rounded-sm tw-px-2 tw-py-1 tw-text-xs tw-font-bold tw-uppercase",
																	currentTeam.winner === true
																		? "tw-border-emerald-500 tw-bg-emerald-500 tw-text-black"
																		: currentTeam.winner === false
																			? "tw-border-rose-500 tw-bg-rose-500 tw-text-black"
																			: "tw-border-yellow-500 tw-bg-yellow-500 tw-text-black",
																)}
															>
																{currentTeam.winner === true
																	? "Victoria"
																	: currentTeam.winner === false
																		? "Derrota"
																		: "Empate"}
															</InlineText>
														</Block>

														<MatchDetails
															match={playedMatch}
															variant="PLAYED_MATCH"
														/>
													</Block>
												);
											})}
										</Block>
									</Collapsible>
								</Block>
							</Block>
						);
					})}
				</Block>
			</Collapsible>
		);
	}

	return (
		<MatchDetails
			variant="DATE_FIXTURE_MATCH"
			match={match}
			className="tw-cursor-pointer"
			onClick={handleSelectMatchClick}
		/>
	);
}

function LeagueStandings({ topKey, data }: { topKey: string; data: T_LeagueStandings }) {
	if (data.length === 0) {
		return null;
	}

	return (
		<Collapsible
			title={<CollapsibleTitle title="Ver las clasificaciones" />}
			contentClassName="tw-pt-1 tw-overflow-auto"
			showIcon={false}
		>
			<table className="tw-min-w-[500px] tw-table-fixed">
				<thead>
					<tr className="">
						<th className="tw-p-1">#</th>
						<th className="tw-p-1 tw-text-left">Equipo</th>
						<th className="tw-w-20 tw-p-1">Puntos</th>
						<th className="tw-w-16 tw-p-1">PJ</th>
						<th className="tw-w-16 tw-p-1">GAF</th>
						<th className="tw-w-16 tw-p-1">GEC</th>
						<th className="tw-w-16 tw-p-1">GD</th>
					</tr>
				</thead>
				<tbody>
					{data.map((teams, teamsIndex) => {
						return (
							<React.Fragment key={generateSlug(`${topKey}-league-standing-${teamsIndex}`)}>
								{teams.map((team, standingIndex) => {
									return (
										<React.Fragment
											key={generateSlug(
												`${topKey}-league-standing-${team.teamId}-${standingIndex}`,
											)}
										>
											<tr>
												<td className="tw-whitespace-nowrap tw-p-1 tw-text-center">
													{standingIndex + 1}
												</td>
												<td className="tw-whitespace-nowrap tw-p-1 tw-text-left">
													{team.teamName}
												</td>
												<td className="tw-p-1 tw-text-center">{team.points}</td>
												<td className="tw-p-1 tw-text-center">{team.stats.played}</td>
												<td className="tw-p-1 tw-text-center">{team.stats.goals.for}</td>
												<td className="tw-p-1 tw-text-center">{team.stats.goals.against}</td>
												<td className="tw-p-1 tw-text-center">{team.stats.goalsDiff}</td>
											</tr>
										</React.Fragment>
									);
								})}
								<tr className="tw-h-4 last:tw-hidden" />
							</React.Fragment>
						);
					})}
				</tbody>
			</table>
		</Collapsible>
	);
}

function CollapsibleTitle({ title, ...rest }: { title: string }) {
	return (
		<Text
			className="tw-text-stone-100"
			{...rest}
		>
			<InlineText>{title}</InlineText> <Icon icon={Icon.icon.CHEVRON_RIGHT} />
		</Text>
	);
}

function MatchDetails({
	match,
	variant,
	className,
	onClick,
	...rest
}: {
	match: T_FixtureMatch | T_PlayedMatch;
	variant: "MARKET_FIXTURE_MATCH" | "DATE_FIXTURE_MATCH" | "PLAYED_MATCH";
	className?: string;
	onClick?: () => void;
}) {
	// --- VARS ---
	const isMarketVariant = variant === "MARKET_FIXTURE_MATCH";
	const { isMatchFinished, isMatchInProgress } = checkMatchStatus(match);
	const isPlayedMatchVariant = checkIsPlayedMatch(match);

	// --- HANDLERS ---
	function handleCopyMatchIdClick(event: DR.React.Events.OnClickEvent<HTMLButtonElement>) {
		event.stopPropagation();
	}

	return (
		<Block
			className={cn("tw-relative tw-rounded-md tw-bg-stone-800 tw-p-2 md:tw-p-6", className)}
			onClick={onClick}
			{...rest}
		>
			<Block className="tw-flex tw-flex-nowrap tw-items-center tw-justify-between tw-gap-4">
				<Block className="tw-min-w-0 tw-max-w-[250px] tw-flex-grow">
					<MatchTeamDetails
						match={match}
						teamSide="home"
					/>
					<Space size={1} />
					<MatchTeamDetails
						match={match}
						teamSide="away"
					/>
				</Block>
				<Block className="tw-w-16 tw-flex-shrink-0 tw-text-right">
					{isMarketVariant ? (
						<Text>{`${match.date} | ${match.hour}`}</Text>
					) : isPlayedMatchVariant || isMatchFinished ? (
						<Block className="tw-text-right tw-text-xs md:tw-text-center">
							{isPlayedMatchVariant ? (
								<Text className="tw-font-bold">
									{replaceAll(match.date, "2024", "24").split("-").reverse().join("/")}
								</Text>
							) : null}
							<Text className="tw-font-bold">{match.hour}</Text>
							{!isPlayedMatchVariant ? <Text>Final del partido</Text> : null}
						</Block>
					) : (
						<Text>{match.hour}</Text>
					)}
				</Block>

				{isMatchInProgress ? (
					<Block
						className={cn(
							"tw-absolute tw-right-2 tw-top-2 tw-mx-auto tw-h-1 tw-w-4 tw-rounded-sm tw-bg-red-500",
							styles["animation"],
						)}
					/>
				) : null}

				<ComponentWithAuth className="tw-absolute tw-bottom-1 tw-right-1">
					<CopyToClipboardPopover textToCopy={match.id}>
						<Button onClick={handleCopyMatchIdClick}>
							<Icon icon={Icon.icon.COPY} />
						</Button>
					</CopyToClipboardPopover>
				</ComponentWithAuth>

				{isMatchFinished && !isPlayedMatchVariant ? (
					<Block
						className={cn(
							"tw-absolute tw-right-2 tw-top-2 tw-mx-auto tw-h-1 tw-w-4 tw-rounded-sm tw-bg-yellow-500",
						)}
					/>
				) : null}
			</Block>

			{isPlayedMatchVariant ? (
				<Block className="tw-absolute tw--bottom-5 tw-left-0 tw-w-full tw-text-center">
					<InlineText className="tw-rounded-b-md tw-bg-stone-800 tw-px-3 tw-py-1 tw-text-xs tw-font-bold tw-text-white tw-underline">
						{match.league.name}
					</InlineText>
				</Block>
			) : (
				<Block className="tw-mt-3 tw-flex tw-gap-2">
					{match.predictions.map((marketPrediction) => {
						return (
							<Text
								key={`${match.id}-${marketPrediction.id}-label`}
								className={cn(
									"tw-relative tw-inline-block tw-rounded-md tw-border-2 tw-bg-black tw-px-2 tw-py-1 tw-text-xs tw-font-bold",
									marketPrediction.trustLevelLabel === "HIGH"
										? "tw-border-green-600"
										: marketPrediction.trustLevelLabel === "MEDIUM"
											? "tw-border-yellow-600"
											: "tw-border-red-600",
								)}
							>
								<InlineText className="tw-mr-1 tw-inline-block tw-align-middle">
									{marketPrediction.id}{" "}
								</InlineText>
								<InlineText className="tw-inline-block tw-align-middle tw-text-xxs">
									{getMarketTrustLevelEmojy(marketPrediction.trustLevelLabel)}
								</InlineText>

								{"results" in marketPrediction ? (
									<InlineText
										className={cn(
											"tw-absolute tw--right-2 tw--top-2 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-black tw-wh-4",
											marketPrediction.results.right || marketPrediction.results.skippedFail
												? "tw-text-green-600"
												: "tw-text-red-600",
										)}
									>
										{marketPrediction.results.right || marketPrediction.results.skippedFail
											? "✓"
											: "✖"}
									</InlineText>
								) : null}
							</Text>
						);
					})}
				</Block>
			)}
		</Block>
	);
}

function MatchTeamDetails({
	match,
	teamSide,
}: {
	match: T_FixtureMatch | T_PlayedMatch;
	teamSide: "home" | "away";
}) {
	// --- VARS ---
	const teamsFromSameCountry = match.teams.home.country === match.teams.away.country;

	return (
		<Block className="tw-flex tw-items-center tw-justify-between tw-gap-2">
			{teamsFromSameCountry ||
			v.isEmptyString(match.teams.home.country) ||
			v.isEmptyString(match.teams.away.country) ? (
				<InlineText className="tw-text-left tw-align-middle tw-text-xl">⚽</InlineText>
			) : (
				<React.Fragment>
					<InlineText className="win:tw-hidden tw-inline-block tw-text-left tw-align-middle tw-text-xl">
						{match.teams.home.country}
					</InlineText>
					<InlineText className="win:tw-inline-block tw-hidden tw-text-left tw-align-middle tw-text-xl">
						⚽
					</InlineText>
				</React.Fragment>
			)}

			<InlineText
				className="tw-flex-1 tw-truncate tw-leading-none"
				title={match.teams[teamSide].name}
			>
				{match.teams[teamSide].name}
				<InlineText className="tw-relative tw--top-0.5 tw-ml-1.5 tw-text-xxs">
					{match.teams[teamSide].featured ? "🟩" : ""}
				</InlineText>
			</InlineText>
			{match.played ? (
				<InlineText className="tw-w-6 tw-text-center tw-font-bold">
					{match.teams[teamSide].score}
				</InlineText>
			) : null}
		</Block>
	);
}

// --- UTILS ---

function formatDate(date: Date, config?: "full") {
	const baseDate = `${date.getFullYear()}-${addLeftPadding(
		date.getMonth() + 1,
	)}-${addLeftPadding(date.getDate())}`;

	if (config === "full") {
		return `${baseDate}T${addLeftPadding(date.getHours())}:${addLeftPadding(date.getMinutes())}`;
	}

	return baseDate;
}

function getRelativeDatesDifference(input: string) {
	const currentDate = dayjs(dateWithoutTime(new Date()));
	const inputDate = dayjs(input);
	const daysDifference = currentDate.diff(inputDate, "day");

	if (daysDifference === 0) {
		return "de hoy";
	}

	if (daysDifference === 1) {
		return "de ayer";
	}

	if (daysDifference === -1) {
		return "de mañana";
	}

	return "";
}

function checkMatchStatus(match: T_FixtureMatch | T_PlayedMatch) {
	const status = {
		isMatchInProgress: false,
		isMatchFinished: false,
	};
	const AVERAGE_MATCH_DURATION = 115;
	const currentDate = formatDate(new Date(), "full");
	const matchEndFullDate = formatDate(
		dayjs(match.fullDate).add(AVERAGE_MATCH_DURATION, "minutes").toDate(),
		"full",
	);

	if (match.played || currentDate >= matchEndFullDate) {
		status.isMatchFinished = true;
	} else if (currentDate >= match.fullDate && currentDate <= matchEndFullDate) {
		status.isMatchInProgress = true;
	}

	return status;
}

function localizeDate(date: string) {
	const formattedDate = new Intl.DateTimeFormat("es", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "GMT",
	}).format(new Date(date));

	return formattedDate;
}

function checkIsPlayedMatch(match: DR.Object): match is T_PlayedMatch {
	return "league" in match;
}

function getMarketTrustLevelEmojy(trustLevel: T_MarketPrediction["trustLevelLabel"]) {
	return trustLevel === "HIGH" ? "🟩" : trustLevel === "MEDIUM" ? "🟨" : "🟥";
}

function generateDates(selectedDate: string) {
	const selectedDateIsToday = formatDate(new Date()) === selectedDate;
	const dateBase = dayjs(selectedDate);
	const dayOfWeek = dateBase.day();
	const isSunday = dayOfWeek === 0;
	const isMonday = dayOfWeek === 1;
	let output;

	if (isSunday) {
		output = [dateBase, ...createArray(6).map((day) => dayjs(dateBase.subtract(day, "days")))];
	} else if (isMonday) {
		output = [dateBase, ...createArray(6).map((day) => dayjs(dateBase.add(day, "days")))];
	} else {
		output = [
			dateBase,
			...(selectedDateIsToday
				? [
						dateBase.subtract(1, "days"),
						dateBase.add(1, "days"),
						...createArray(6 - dayOfWeek).map((day) => dayjs(dateBase.add(day + 1, "days"))),
						...createArray(dayOfWeek - 1).map((day) => dayjs(dateBase.subtract(day, "days"))),
					]
				: [
						...createArray(dayOfWeek - 1).map((day) => dayjs(dateBase.subtract(day, "days"))),
						...createArray(7 - dayOfWeek).map((day) => dayjs(dateBase.add(day, "days"))),
					].sort((a, b) => a.unix() - b.unix())),
		];
	}

	return output.map((item) => formatDate(item.toDate()));
}

// --- TYPES ---

type T_FiltersValues = "Todos" | "Local" | "Visitante" | "Ganados" | "Perdidos" | "Empatados";

type T_PlayedMatchesFilters = DR.Object<T_FiltersValues>;

type T_Data = DR.Object<T_DayOfMatches>;

/*
function toggleRenderType() {
  setRenderType((currentValue) => {
    return currentValue === "MARKET" ? "DATE" : "MARKET";
  });
}

<Block className="tw-text-center">
  <BoxWithTitle
    title="Agrupar por:"
    className="tw-flex tw-gap-2 tw-p-5"
  >
    <Button
      variant={Button.variant.STYLED}
      className={cn(renderType === "DATE" && "dr-bg-color-surface-300")}
      onClick={toggleRenderType}
      disabled
    >
      Fecha
    </Button>
    <Button
      variant={Button.variant.STYLED}
      className={cn(renderType === "MARKET" && "dr-bg-color-surface-300")}
      onClick={toggleRenderType}
    >
      Mercado
    </Button>
  </BoxWithTitle>
</Block>
<Space size={4} />

function RenderByMarket({ data }: T_BetsPageProps) {
	// --- UTILS ---
	function groupByMarket() {
		const output = {} as DR.Object<{
			stats: DR.Object<number>;
			matches: (T_FixtureMatch & { league: Pick<T_League, "country" | "name"> })[];
		}>;

		Object.values(data).forEach((fixtureLeagues) => {
			fixtureLeagues.forEach((league) => {
				league.matches.forEach((match) => {
					match.predictions.forEach((prediction) => {
						if (!output[prediction.name]) {
							output[prediction.name] = { stats: {}, matches: [] };
						}

						output[prediction.name].matches.push({
							...match,
							league: { country: league.country, name: league.name },
						});
					});
				});
			});
		});

		Object.entries(output).forEach(([marketName, market]) => {
			output[marketName].stats = output[marketName].matches.reduce(
				(result, match) => {
					const newResult = {
						...result,
					};

					const prediction = match.predictions.find((item) => item.name === marketName);

					if (prediction) {
						if (prediction.recommendable) {
							newResult.recomendables += 1;
						}

						if (match.played) {
							const isPlayedMatchPrediction = checkIsPlayedMatchPrediction(match, prediction);
							newResult.total_de_partidos_finalizados += 1;

							if (prediction.recommendable) {
								newResult.recomendables_finalizadas += 1;

								if (isPlayedMatchPrediction) {
									if (prediction.right) {
										newResult.acertadas += 1;
									}

									if (prediction.fail) {
										newResult.falladas += 1;
									}
								}
							}

							if (isPlayedMatchPrediction) {
								if (prediction.lostRight) {
									newResult.aciertos_perdidos += 1;
								}
								if (prediction.skippedFail) {
									newResult.fallos_evitados += 1;
								}
							}
						}
					}

					return newResult;
				},
				{
					total_de_partidos: output[marketName].matches.length,
					total_de_partidos_finalizados: 0,
					recomendables: 0,
					recomendables_finalizadas: 0,
					acertadas: 0,
					falladas: 0,
					aciertos_perdidos: 0,
					fallos_evitados: 0,
				},
			);

			output[marketName].matches = market.matches.sort(
				(matchA: T_FixtureMatch, matchB: T_FixtureMatch) => {
					const predictionTeamA = matchA.predictions.find((prediction) => {
						return prediction.name === marketName;
					}) as T_FixtureMatch["predictions"][number];
					const predictionTeamB = matchB.predictions.find((prediction) => {
						return prediction.name === marketName;
					}) as T_FixtureMatch["predictions"][number];
					const isPlayedMatchPredictionA = checkIsPlayedMatchPrediction(matchA, predictionTeamA);
					const isPlayedMatchPredictionB = checkIsPlayedMatchPrediction(matchB, predictionTeamB);

					if (matchA.played && !matchB.played) {
						return 1;
					}

					if (!matchA.played && matchB.played) {
						return -1;
					}

					if (predictionTeamA.recommendable && !predictionTeamB.recommendable) {
						return -1;
					}

					if (!predictionTeamA.recommendable && predictionTeamB.recommendable) {
						return 1;
					}

					if (predictionTeamA.warnings.length === 0 && predictionTeamB.warnings.length > 0) {
						return -1;
					}

					if (predictionTeamA.warnings.length > 0 && predictionTeamB.warnings.length === 0) {
						return 1;
					}

					if (isPlayedMatchPredictionA && isPlayedMatchPredictionB) {
						if (predictionTeamA.skippedFail && !predictionTeamB.skippedFail) {
							return -1;
						}

						if (!predictionTeamA.skippedFail && predictionTeamB.skippedFail) {
							return 1;
						}

						if (predictionTeamA.lostRight && !predictionTeamB.lostRight) {
							return -1;
						}

						if (!predictionTeamA.lostRight && predictionTeamB.lostRight) {
							return 1;
						}
					}

					return predictionTeamA.acceptancePercentage > predictionTeamB.acceptancePercentage
						? -1
						: predictionTeamA.acceptancePercentage < predictionTeamB.acceptancePercentage
							? 1
							: 0;
				},
			);
		});

		return output;
	}

	return Object.entries(groupByMarket()).map(([marketName, market]) => {
		return (
			<Collapsible
				key={marketName}
				title={marketName}
				className="tw-mb-4 last:tw-mb-0"
				contentClassName="tw-py-5 tw-px-5 tw-ml-5 tw dr-bg-color-surface-200 tw-mt-2"
			>
				<Collapsible
					title="Estadísticas"
					className="tw-mb-2"
					contentClassName="tw-pt-1"
				>
					<Pre className="tw-w-full tw-max-w-full tw-overflow-x-auto tw-overflow-y-hidden tw-rounded-md tw-px-4 tw-py-3 tw-text-sm dr-bg-color-surface-300">
						{Object.entries(market.stats).map(([key, value]) => {
							return (
								<Text key={generateSlug(`${marketName}-stats-${key}`)}>
									<InlineText is="strong">- {jsConvertCase.toSentenceCase(key)}</InlineText>:{" "}
									<InlineText>{value}</InlineText>
								</Text>
							);
						})}
					</Pre>
				</Collapsible>
				<Space size={5} />

				{market.matches.map((match) => {
					return (
						<FixtureMatch
							key={match.id}
							variant="market"
							topKey={marketName}
							match={match}
							league={match.league}
						/>
					);
				})}
			</Collapsible>
		);
	});
}
*/
