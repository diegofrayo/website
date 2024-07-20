import * as React from "react";
import jsConvertCase from "js-convert-case";
import dayjs from "dayjs";

import { Page } from "~/components/layout";
import {
	Block,
	Collapsible,
	Icon,
	InlineText,
	Input,
	Link,
	Pre,
	Select,
	Space,
	Text,
	Title,
} from "~/components/primitive";
import cn from "~/lib/cn";
import http from "~/lib/http";
import { useDidMount } from "@diegofrayo/hooks";
import type DR from "@diegofrayo/types";
import { dateWithoutTimezone } from "@diegofrayo/utils/dates";
import { safeAsync } from "@diegofrayo/utils/misc";
import { addLeftPadding, generateSlug, replaceAll } from "@diegofrayo/utils/strings";

import type {
	T_DayOfMatches,
	T_FixtureMatch,
	T_League,
	T_LeagueStandings,
	T_PlayedMatch,
} from "./types";
import styles from "./styles.module.css";

function BetsPage() {
	// --- STATES & REFS ---
	const [renderType] = React.useState<"MARKET" | "DATE">("DATE");
	const [selectedDate, setSelectedDate] = React.useState(formatDate(dateWithoutTimezone()));
	const [isLoading, setIsLoading] = React.useState(true);
	const [data, setData] = React.useState<undefined | T_Data>(undefined);

	// --- EFFECTS ---
	useDidMount(() => {
		fetchData(selectedDate);
	});

	// --- HANDLERS ---
	function handleInputDateChange(event: DR.React.Events.OnChangeEvent) {
		setSelectedDate(event.currentTarget.value);
		fetchData(event.currentTarget.value);
	}

	/*
	function toggleRenderType() {
		setRenderType((currentValue) => {
			return currentValue === "MARKET" ? "DATE" : "MARKET";
		});
	}
  */

	// --- HANDLERS ---
	async function fetchData(date: string) {
		try {
			setIsLoading(true);

			const dateBase = dayjs(date);
			const dateYesterday = dateBase.subtract(1, "day");
			const dateTomorrow = dateBase.add(1, "day");
			const dates = [dateBase, dateYesterday, dateTomorrow].map((item) =>
				formatDate(item.toDate()),
			);

			const newData = (
				await Promise.all(
					dates.map((item) => {
						return safeAsync(() => http.get<T_DayOfMatches>(`/data/apps/bets/${item}.json`));
					}),
				)
			).reduce((result, [response], index) => {
				if (response) {
					return {
						...result,
						// TODO: Check it out this TS error
						// @ts-ignore
						[dates[index]]: response.data,
					};
				}

				return result;
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
					className="tw-border-b tw-border-zinc-600"
				>
					<Title
						is="h1"
						className="tw-mx-auto tw-max-w-[1280px] tw-p-4 tw-text-2xl tw-text-white dr-font-main-title"
					>
						<Icon
							icon={Icon.icon.TROPHY_SOLID}
							wrapperClassName="tw-align-middle tw-mr-2"
							size={26}
						/>
						<InlineText className="tw-align-middle">BETS</InlineText>
					</Title>
				</Block>
				{/*
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
        */}

				<Block className="tw-mx-auto tw-max-w-[1280px] tw-p-4">
					<Block className="tw-text-white">
						<Text className="tw-text-sm tw-font-bold">Seleccionar fecha:</Text>
						<Space size={1} />
						<Input
							type="date"
							id="input-dates-selector"
							className="tw-h-16 tw-max-w-[200px] tw-rounded-md tw-border tw-border-zinc-600 tw-bg-black tw-px-4 tw-text-center"
							value={selectedDate}
							onChange={handleInputDateChange}
						/>
					</Block>
					<Space
						size={10}
						variant={Space.variant.SIMPLE}
					/>

					{isLoading ? (
						<Block>Cargando...</Block>
					) : data ? (
						renderType === "MARKET" ? null : ( // <RenderByMarket data={data} />
							<RenderByDate data={data} />
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
			className="tw-min-h-screen tw-bg-black tw-text-sm tw-text-zinc-100 lg:tw-text-base"
		>
			{children}
		</Block>
	);
}

/*
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

function RenderByDate({ data }: { data: T_Data }) {
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
		<Block>
			{Object.entries(data).map(([fixtureDate, fixtureLeagues]) => {
				return (
					<Collapsible
						key={fixtureDate}
						title={
							<Block>
								<Text className="tw-text-lg tw-font-bold tw-text-white">Partidos</Text>
								<Text className="tw-text-stone-300">{localizeDate(fixtureDate)}</Text>
							</Block>
						}
						className="tw-mb-8 last:tw-mb-0"
						contentClassName="tw-py-6"
						showIcon={false}
					>
						{fixtureLeagues.map((league) => {
							const leagueName = `${league.name}`;

							if (league.matches.length === 0) {
								return null;
							}

							return (
								<Collapsible
									key={`${fixtureDate}-${leagueName}`}
									title={
										<Title is="h2">
											<Block
												is="span"
												className="tw-mr-2 tw-inline-flex tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-zinc-800 tw-wh-8"
											>
												<Block
													is="span"
													className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-zinc-600 tw-p-0.5 tw-text-lg tw-wh-7"
												>
													{league.flag}
												</Block>
											</Block>

											<InlineText className="tw-truncate tw-text-base tw-text-gray-100">
												{leagueName}
											</InlineText>
										</Title>
									}
									showIcon={false}
									contentClassName="tw-px-4 tw-border-l-4 tw-m-4 tw-border-zinc-600"
									className="tw-mb-6 last:tw-mb-0"
								>
									<LeagueStandings
										topKey={fixtureDate}
										data={league.standings}
									/>
									{league.standings.length > 0 ? <Space size={1} /> : null}

									{Object.entries(groupMatchesByDate(league.matches)).map(
										([date, matchesGroupedByDate]) => {
											return (
												<Block
													key={`${leagueName}-${date}`}
													className="tw-flex tw-flex-wrap tw-justify-start tw-gap-4"
												>
													{matchesGroupedByDate.map((match) => {
														return (
															<FixtureMatch
																key={match.id}
																// variant="date"
																topKey={date}
																match={match}
																league={league}
															/>
														);
													})}
												</Block>
											);
										},
									)}
								</Collapsible>
							);
						})}
					</Collapsible>
				);
			})}
		</Block>
	);
}

function FixtureMatch({
	// variant,
	topKey,
	match,
	league,
}: {
	// variant: "DATE" | "MARKET";
	topKey: string;
	match: T_FixtureMatch;
	league: Pick<T_League, "country" | "name">;
}) {
	// --- STATES & REFS ---
	const [matchesFilters, setMatchesFilters] = React.useState<T_PlayedMatchesFilters>({});
	const [matchOpenedId, setMatchOpenedId] = React.useState("");

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

	function onShowContentHandler() {
		setMatchOpenedId(match.id);
	}

	function onHideContentHandler() {
		setMatchOpenedId("");
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

	return (
		<Collapsible
			title={
				<MatchDetails
					match={match}
					className="tw-cursor-pointer"
					variant="DATE_FIXTURE_MATCH"
				/>
			}
			className={cn(
				"tw-overflow-hidden tw-rounded-md",
				match.id === matchOpenedId ? "tw-w-full" : "tw-w-80",
			)}
			contentClassName="tw-bg-zinc-900 tw-p-4"
			showIcon={false}
			onShowContentHandler={onShowContentHandler}
			onHideContentHandler={onHideContentHandler}
		>
			{/*
			<Collapsible
				title="Predicciones de apuestas"
				contentClassName="tw-pt-0.5"
			>
				{match.predictions.map((prediction) => {
					return (
						<Block
							key={generateSlug(`${match.id}-${prediction.name}`)}
							className="tw-mb-2 tw-overflow-hidden tw-rounded-md tw-px-4 tw-py-3 dr-bg-color-surface-300 last:tw-mb-0"
						>
							<Text className="tw-text-lg tw-font-bold">
								<InlineText className="tw-underline">{prediction.name}</InlineText>
								{prediction.recommendable ? (
									<InlineText className="tw-ml-1 tw-text-sm">🌟</InlineText>
								) : null}
							</Text>
							<Space size={1} />

							<Block>
								<Text>
									<InlineText is="strong">- Es recomendable:</InlineText>{" "}
									<InlineText className="tw-text-xs">
										{prediction.recommendable ? "✅" : "❌"}
									</InlineText>
								</Text>
								<Text>
									<InlineText is="strong">- Porcentaje de aceptacion:</InlineText>{" "}
									<InlineText>{prediction.acceptancePercentage * 100}%</InlineText>
								</Text>

								<Text className="tw-font-bold">- Criterios:</Text>
								<List variant={List.variant.SIMPLE}>
									{prediction.criteria.map((criteria) => {
										return (
											<List.Item
												key={generateSlug(`${match.id}-${criteria.description}`)}
												className={cn(
													"tw-ml-3 tw-text-sm",
													criteria.weight > 0 ? "tw-underline" : "",
												)}
											>
												<InlineText className="tw-mr-2">{criteria.description}</InlineText>
												<InlineText className="tw-text-xs">{criteria.check}</InlineText>
											</List.Item>
										);
									})}
								</List>

								{prediction.warnings.length > 0 ? (
									<React.Fragment>
										<Text className="tw-font-bold">- Advertencias:</Text>
										<List variant={List.variant.SIMPLE}>
											{prediction.warnings.map((warning, warningIndex) => {
												return (
													<List.Item
														key={generateSlug(`${match.id}-${warningIndex}`)}
														className="tw-ml-3 tw-text-sm"
													>
														<InlineText className="tw-mr-2">{warning.description}</InlineText>
													</List.Item>
												);
											})}
										</List>
									</React.Fragment>
								) : null}
							</Block>
						</Block>
					);
				})}
			</Collapsible>
			<Space
				size={4}
				variant={Space.variant.DASHED}
			/>
      */}

			<Block className="tw-flex tw-flex-wrap tw-items-start tw-justify-between tw-gap-4 tw-overflow-auto md:tw-overflow-hidden lg:tw-flex-nowrap">
				{Object.entries(match.teams).map(([teamSide, team]) => {
					return (
						<Block
							key={team.name}
							className="tw-min-w-[500px] tw-flex-shrink-0 tw-overflow-auto tw-rounded-sm tw-bg-zinc-800 sm:tw-min-w-full lg:tw-min-w-fit lg:tw-flex-1"
						>
							<Block className="tw-relative tw-flex tw-justify-between tw-bg-zinc-700 tw-px-4 tw-py-1">
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

							<Block className="tw-px-4 tw-py-4">
								<Collapsible
									title={<CollapsibleTitle title="Ver estadísticas" />}
									className="tw-mb-2"
									contentClassName="tw-pt-2 tw-px-1 tw-pb-6"
									showIcon={false}
								>
									<Pre className="tw-w-full tw-max-w-full tw-overflow-x-auto tw-overflow-y-hidden tw-rounded-md tw-bg-zinc-900 tw-px-4 tw-py-3 tw-text-sm tw-text-zinc-400">
										{Object.entries(team.stats).map(([key, value]) => {
											if (key.includes("---")) {
												return (
													<Space
														key={`${match.id}-stats-${key}`}
														size={2}
													/>
												);
											}

											return (
												<Text key={`${match.id}-stats-${key}`}>
													<InlineText is="strong">- {jsConvertCase.toSentenceCase(key)}</InlineText>
													: {value}
													{key.includes("porcentaje") ? "%" : ""}
												</Text>
											);
										})}
									</Pre>
								</Collapsible>

								<Collapsible
									title={<CollapsibleTitle title="Ver historial de partidos" />}
									contentClassName="tw-pt-2 tw-px-1 tw-pb-6"
									showIcon={false}
								>
									<Block>
										<Select
											id={generateSlug(`${topKey}-${match.id}-matches-filter-${teamSide}`)}
											variant={Select.variant.STYLED}
											defaultValue={teamSide === "home" ? "Local" : "Visitante"}
											onChange={onMatchesFilterChange(team.name)}
										>
											<Select.Option value="Todos">Todos</Select.Option>
											<Select.Option value="Local">Local</Select.Option>
											<Select.Option value="Visitante">Visitante</Select.Option>
											<Select.Option value="Ganados">Ganados</Select.Option>
											<Select.Option value="Perdidos">Perdidos</Select.Option>
											<Select.Option value="Empatados">Empatados</Select.Option>
										</Select>
									</Block>
									<Space size={1} />

									<Block className="tw-rounded-md tw-bg-zinc-900 tw-p-6">
										{filterMatches(
											team.matches,
											team.name,
											matchesFilters[team.name] || (teamSide === "home" ? "Local" : "Visitante"),
										).map((playedMatch) => {
											const currentTeam =
												playedMatch.teams.home.name === team.name
													? playedMatch.teams.home
													: playedMatch.teams.away;

											return (
												<Block
													key={`${generateSlug(playedMatch.id + playedMatch.hour)}`}
													className={cn(
														"tw-relative tw-mb-6 tw-rounded-sm tw-border-2 tw-px-4 tw-pb-6 tw-pt-6 last:tw-mb-0",
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
																	: "Empate"}{" "}
														</InlineText>
													</Block>

													<MatchDetails
														match={playedMatch}
														variant="PLAYED_MATCH"
													/>

													{/*
													<Text className="lg:tw-truncate">
														<InlineText>{composeMatchTitle(playedMatch)}</InlineText>
													</Text>
													<Block className="tw-ml-0 lg:tw-ml-5">
														<Text>
															{composeTeamsCountry(
																playedMatch.teams.home.country,
																playedMatch.teams.away.country,
															)}
														</Text>
														<Text className="tw-mb-4 tw-flex tw-flex-col tw-justify-between tw-text-sm lg:tw-flex-row">
															<InlineText className="tw-italic">{playedMatch.date}</InlineText>

															{Number.isInteger(playedMatch.teams.home.position) &&
															Number.isInteger(playedMatch.teams.away.position) ? (
																<InlineText>
																	{`Posiciones: [${playedMatch.teams.home.position}] | [${playedMatch.teams.away.position}]`}
																</InlineText>
															) : null}
														</Text>
													</Block>
                          */}
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
			className="tw-text-zinc-100"
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
	...rest
}: {
	match: T_FixtureMatch | T_PlayedMatch;
	variant: "MARKET_FIXTURE_MATCH" | "DATE_FIXTURE_MATCH" | "PLAYED_MATCH";
	className?: string;
}) {
	// --- VARS ---
	const isMarketVariant = variant === "MARKET_FIXTURE_MATCH";
	const isPlayedMatchVariant = variant === "PLAYED_MATCH";
	const teamsFromSameCountry = match.teams.home.country === match.teams.away.country;
	const isMatchPlaying = match.played === false && checkMatchStarted(match.fullDate);

	return (
		<Block
			className={cn(
				"tw-relative tw-flex tw-h-28 tw-max-w-full tw-flex-nowrap tw-items-center tw-justify-between tw-gap-4 tw-bg-zinc-800 tw-p-6",
				className,
			)}
			{...rest}
		>
			<Block className="tw-w-48 tw-max-w-[250px] tw-flex-grow">
				<Block className="tw-flex tw-items-center tw-justify-between tw-gap-2">
					{teamsFromSameCountry ? (
						<InlineText className="tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-zinc-500 tw-wh-7">
							⚽
						</InlineText>
					) : (
						<React.Fragment>
							<InlineText className="win:tw-hidden tw-relative tw-top-0.5 tw-text-3xl">
								{match.teams.home.country}
							</InlineText>
							<InlineText className="win:tw-inline-block tw-text-left tw-align-middle tw-text-xl">
								⚽
							</InlineText>
						</React.Fragment>
					)}

					<InlineText
						className="tw-flex-1 tw-truncate tw-leading-none"
						title={match.teams.home.name}
					>
						{match.teams.home.name}
						<InlineText className="tw-relative tw--top-0.5 tw-ml-1.5 tw-text-xxs">
							{match.teams.home.featured ? "🟩" : ""}
						</InlineText>
					</InlineText>
					{match.played ? (
						<InlineText className="tw-w-6 tw-text-center tw-font-bold">
							{match.teams.home.score}
						</InlineText>
					) : null}
				</Block>
				<Space size={1} />
				<Block className="tw-flex tw-items-center tw-justify-between tw-gap-2">
					{teamsFromSameCountry ? (
						<InlineText className="tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-zinc-500 tw-wh-7">
							⚽
						</InlineText>
					) : (
						<React.Fragment>
							<InlineText className="win:tw-hidden tw-relative tw-top-0.5 tw-text-3xl">
								{match.teams.away.country}
							</InlineText>
							<InlineText className="win:tw-inline-block tw-text-left tw-align-middle tw-text-xl">
								⚽
							</InlineText>
						</React.Fragment>
					)}
					<InlineText
						className="tw-flex-1 tw-truncate tw-leading-none"
						title={match.teams.away.name}
					>
						{match.teams.away.name}
						<InlineText className="tw-relative tw--top-0.5 tw-ml-1.5 tw-text-xxs">
							{match.teams.away.featured ? "🟩" : ""}
						</InlineText>
					</InlineText>
					{match.played ? (
						<InlineText className="tw-w-6 tw-text-center tw-font-bold">
							{match.teams.away.score}
						</InlineText>
					) : null}
				</Block>
			</Block>
			<Block className="tw-w-16 tw-flex-shrink-0 tw-text-right">
				{isMarketVariant ? (
					<Text>{`${match.date} | ${match.hour}`}</Text>
				) : isPlayedMatchVariant ? (
					<Block className="tw-text-center tw-text-xs">
						<Text className="tw-font-bold">
							{replaceAll(match.date, "2024", "24").split("-").reverse().join("/")}
						</Text>
						<Text className="tw-font-bold">{match.hour}</Text>
					</Block>
				) : (
					<Text>{match.hour}</Text>
				)}
			</Block>

			{isMatchPlaying ? (
				<Block
					className={cn(
						"tw-absolute tw-right-2 tw-top-2 tw-mx-auto tw-h-1 tw-w-4 tw-rounded-sm tw-bg-red-500",
						styles["animation"],
					)}
				/>
			) : null}

			{/*
      <Block className="tw-flex tw-items-center tw-justify-center tw-gap-4">
        {match.predictions.map((prediction) => {
          const isPlayedMatchPrediction = checkIsPlayedMatchPrediction(match, prediction);

          if (isMarketVariant && prediction.name !== topKey) {
            return null;
          }

          return (
            <Block
              key={`${match.id}-${prediction.id}`}
              className={cn(
                "tw-relative tw-rounded-md tw-border tw-bg-black tw-pr-1 tw-shadow-sm dr-border-color-surface-400",
                isPlayedMatchPrediction
                  ? prediction.right || prediction.skippedFail
                    ? "tw-shadow-green-500"
                    : "tw-shadow-red-500"
                  : "dr-shadow-color-primary-500",
              )}
            >
              <InlineText className="tw-inline-block tw-px-2 tw-py-1.5 tw-text-sm tw-text-white dr-bg-color-surface-300">
                {prediction.id}
              </InlineText>
              <Block className="tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-px-2 tw-text-xs">
                <InlineText>{prediction.recommendable ? "🌟" : "👎"}</InlineText>

                {isPlayedMatchPrediction ? (
                  <React.Fragment>
                    {prediction.right || prediction.skippedFail ? (
                      <InlineText>✅</InlineText>
                    ) : null}
                    {prediction.fail || prediction.lostRight ? (
                      <InlineText>❌</InlineText>
                    ) : null}
                  </React.Fragment>
                ) : null}

                {prediction.warnings.length > 0 ? (
                  <InlineText className="tw-absolute tw--bottom-1 tw--right-1">⚠️</InlineText>
                ) : null}
              </Block>
            </Block>
          );
        })}
      </Block>
      */}
		</Block>
	);
}

// --- UTILS ---

function formatDate(date: Date) {
	return `${date.getFullYear()}-${addLeftPadding(
		date.getMonth() + 1,
	)}-${addLeftPadding(date.getDate())}`;
}

function checkMatchStarted(fullDate: string) {
	const currentDate = new Date();
	const currentDateFormatted = `${formatDate(currentDate)}T${addLeftPadding(new Date().getHours())}:${addLeftPadding(new Date().getMinutes())}`;

	return currentDateFormatted >= fullDate;
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

/*
function checkIsPlayedMatchPrediction(
	match: T_FixtureMatch,
	_: unknown,
): _ is T_PlayedMatchPrediction {
	return match.played;
}
*/

// --- TYPES ---

type T_FiltersValues = "Todos" | "Local" | "Visitante" | "Ganados" | "Perdidos" | "Empatados";

type T_PlayedMatchesFilters = DR.Object<T_FiltersValues>;

type T_Data = DR.Object<T_DayOfMatches>;
