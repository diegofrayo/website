import * as React from "react";
import jsConvertCase from "js-convert-case";

import { MainLayout, Page } from "~/components/layout";
import {
	Block,
	Collapsible,
	Icon,
	InlineText,
	Link,
	List,
	Pre,
	Select,
	Space,
	Text,
	Title,
} from "~/components/primitive";
import { withAuthRulesPage } from "~/modules/auth";
import type DR from "@diegofrayo/types";
import { addLeftPadding, generateSlug } from "@diegofrayo/utils/strings";

function BetsPage({ data }: T_BetsPageProps) {
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
					[teamName]: event.currentTarget.value as T_FiltersValues,
				};
			});
		};
	}

	// --- UTILS ---
	function filterMatches(matches: T_PlayedMatch[], teamName: string, filter: T_FiltersValues) {
		if (filter === "Todos") {
			return matches;
		}

		if (filter === "Local") {
			return matches.filter((match) => {
				return match.teams.home.name === teamName;
			});
		}

		if (filter === "Visitante") {
			return matches.filter((match) => {
				return match.teams.away.name === teamName;
			});
		}

		if (filter === "Ganados") {
			return matches.filter((match) => {
				return (
					(match.teams.home.name === teamName && match.teams.home.winner === true) ||
					(match.teams.away.name === teamName && match.teams.away.winner === true)
				);
			});
		}

		if (filter === "Perdidos") {
			return matches.filter((match) => {
				return (
					(match.teams.home.name === teamName && match.teams.home.winner === false) ||
					(match.teams.away.name === teamName && match.teams.away.winner === false)
				);
			});
		}

		if (filter === "Empatados") {
			return matches.filter((match) => {
				return (
					(match.teams.home.name === teamName && match.teams.home.winner === null) ||
					(match.teams.away.name === teamName && match.teams.away.winner === null)
				);
			});
		}

		return matches;
	}

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
			{} as { [key in string]: T_FixtureMatch[] },
		);
	}

	function composeFixtureMatchTitle(match: T_FixtureMatch) {
		const title = `${match.teams.home.featured ? "🔰" : ""}${match.teams.home.name} ${
			match.teams.home.score === null ? "" : `(${match.teams.home.score})`
		} - ${match.teams.away.featured ? "🔰" : ""}${match.teams.away.name} ${
			match.teams.away.score === null ? "" : `(${match.teams.away.score})`
		} | ${match.hour}`;

		if (match.predictions[0].recommendable) {
			return `${title} 🌟`;
		}

		return title;
	}

	function composePlayedMatchTitle(match: T_PlayedMatch) {
		const title = `${match.teams.home.featured ? "🔰" : ""}${match.teams.home.name} ${
			match.teams.home.score === null ? "" : `(${match.teams.home.score})`
		} - ${match.teams.away.featured ? "🔰" : ""}${match.teams.away.name} ${
			match.teams.away.score === null ? "" : `(${match.teams.away.score})`
		} | ${match.hour}`;

		return title;
	}

	function checkMatchStarted(fullDate: string) {
		const currentDate = new Date();
		const currentDateFormatted = `${currentDate.getFullYear()}-${addLeftPadding(
			currentDate.getMonth() + 1,
		)}-${addLeftPadding(currentDate.getDate())}T${addLeftPadding(
			new Date().getHours(),
		)}:${addLeftPadding(new Date().getMinutes())}`;

		return currentDateFormatted >= fullDate;
	}

	return (
		<Page
			config={{
				title: "Bets",
				disableSEO: true,
			}}
		>
			<MainLayout
				title="Bets"
				className="tw-max-w-[1280px] tw-text-sm lg:tw-text-base"
			>
				{Object.entries(data).map(([fixtureDate, leagues], index) => {
					return (
						<Collapsible
							key={fixtureDate}
							title={`${fixtureDate}${index === 0 ? " (Hoy)" : ""}`}
							className="tw-mb-4 last:tw-mb-0"
							contentClassName="tw-pt-2"
							opened={index === 0}
						>
							{/*
              <Block className="tw-text-center">
                <InlineText className="tw-inline-block tw-rounded-md tw-px-2 tw-py-0.5 tw-text-sm tw-font-bold tw-italic dr-text-color-primary-100 dr-bg-color-surface-300">
                  {fixtureDate}
                </InlineText>
              </Block>
              <Space size={2} />
              */}

							{leagues.map((league) => {
								const leagueName = `${league.name} (${league.country})`;

								if (league.matches.length === 0) {
									return null;
								}

								return (
									<Block
										key={`${fixtureDate}-${leagueName}`}
										className="tw-mb-8 tw-overflow-auto tw-rounded-md dr-bg-color-surface-200"
									>
										<Title
											is="h2"
											className="tw-p-2 tw-text-center tw-text-base tw-text-white dr-bg-color-surface-300 lg:tw-text-xl"
										>
											{leagueName}
										</Title>

										<Block className="tw-p-5">
											{league.standings.length > 0 ? (
												<React.Fragment>
													<Collapsible
														title="Posiciones"
														contentClassName="tw-pt-1"
													>
														<Pre className="tw-w-full tw-max-w-full tw-overflow-auto tw-rounded-md tw-px-4 tw-py-3 dr-bg-color-surface-100">
															{league.standings
																.map((team, standingIndex) => {
																	return `${standingIndex + 1}. ${team.teamName} | ${team.points}`;
																})
																.join("\n")}
														</Pre>
													</Collapsible>
													<Space
														size={4}
														variant={Space.variant.DASHED}
													/>
												</React.Fragment>
											) : null}

											{Object.entries(groupMatchesByDate(league.matches)).map(
												([date, matchesGroupedByDate]) => {
													return (
														<Block
															key={`${leagueName}-${date}`}
															className="tw-mb-4 last:tw-mb-0"
														>
															{/*
                              <Title
                                is="h3"
                                className="tw-mb-2 tw-text-xl tw-text-white tw-underline"
                              >
                                {date}
                              </Title>
                              */}

															{matchesGroupedByDate.map((match) => {
																return (
																	<Collapsible
																		key={match.id}
																		title={composeFixtureMatchTitle(match)}
																		className="tw-mb-2 last:tw-mb-0"
																		contentClassName="tw-pt-2"
																		titleClassName={
																			checkMatchStarted(match.fullDate)
																				? "tw-text-red-700"
																				: "tw-text-green-700"
																		}
																	>
																		<Collapsible
																			title="Predicciones de apuestas"
																			contentClassName="tw-pt-0.5"
																		>
																			{match.predictions.map((prediction) => {
																				return (
																					<Block
																						key={generateSlug(`${match.id}-${prediction.name}`)}
																						className="tw-overflow-hidden tw-rounded-md tw-px-4 tw-py-3 dr-bg-color-surface-300"
																					>
																						<Text className="tw-text-xl tw-font-bold">
																							<InlineText className="tw-underline">
																								{prediction.name}
																							</InlineText>
																							{prediction.recommendable ? (
																								<InlineText className="tw-ml-1 tw-text-sm">
																									🌟
																								</InlineText>
																							) : null}
																						</Text>
																						<Space size={1} />

																						<Block className="tw-text-base">
																							<Text>
																								<InlineText is="strong">
																									- Es recomendable:
																								</InlineText>{" "}
																								<InlineText className="tw-text-xs">
																									{prediction.recommendable ? "✅" : "❌"}
																								</InlineText>
																							</Text>
																							<Text>
																								<InlineText is="strong">
																									- Porcentaje de aceptacion:
																								</InlineText>{" "}
																								<InlineText>
																									{prediction.acceptancePercentage * 100}%
																								</InlineText>
																							</Text>

																							<Text className="tw-font-bold">- Criterios:</Text>
																							<List variant={List.variant.SIMPLE}>
																								{prediction.criteria.home.map((criteria) => {
																									return (
																										<List.Item
																											key={generateSlug(
																												`${match.id}-${criteria.description}`,
																											)}
																											className="tw-ml-3 tw-text-sm"
																										>
																											<InlineText className="tw-mr-2">
																												{criteria.description}
																											</InlineText>
																											<InlineText className="tw-text-xs">
																												{criteria.check}
																											</InlineText>
																										</List.Item>
																									);
																								})}
																							</List>
																						</Block>
																					</Block>
																				);
																			})}
																		</Collapsible>
																		<Space
																			size={4}
																			variant={Space.variant.DASHED}
																		/>

																		<Block className="tw-flex tw-flex-wrap tw-justify-between tw-gap-2 lg:tw-flex-nowrap">
																			{Object.entries(match.teams).map(([teamSide, team]) => {
																				return (
																					<Block
																						key={team.name}
																						className="tw-w-full tw-flex-shrink-0 tw-overflow-auto tw-rounded-md lg:tw-w-[50%]"
																					>
																						<Title
																							is="h4"
																							className="tw-relative tw-p-1 tw-text-center dr-bg-color-surface-100"
																						>
																							<InlineText>
																								{team.name}{" "}
																								{Number.isInteger(team.standings)
																									? `[${team.standings}]`
																									: ""}
																							</InlineText>
																							<Link
																								variant={Link.variant.SIMPLE}
																								href={`https://www.google.com/search?q=${encodeURIComponent(
																									`${team.name} equipo ${league.country} 365scores`,
																								)}`}
																								className="tw-absolute tw-right-2"
																								isExternalLink
																							>
																								<Icon
																									icon={Icon.icon.GOOGLE}
																									size={16}
																								/>
																							</Link>
																						</Title>

																						<Block className="tw-px-4 tw-pb-1 tw-pt-3 dr-bg-color-surface-300">
																							<Collapsible
																								title="Estadísticas"
																								className="tw-mb-2"
																								contentClassName="tw-pt-1"
																							>
																								<Pre className="tw-w-full tw-max-w-full tw-overflow-auto tw-rounded-md tw-px-4 tw-py-3 tw-text-base dr-bg-color-surface-200">
																									{Object.entries(team.stats).map(
																										([key, value]) => {
																											if (key.includes("--")) {
																												return (
																													<Space
																														key={`${match.id}-stats-${key}`}
																														size={2}
																													/>
																												);
																											}

																											return (
																												<Text key={`${match.id}-stats-${key}`}>
																													<InlineText is="strong">
																														- {jsConvertCase.toSentenceCase(key)}
																													</InlineText>
																													: {value}
																												</Text>
																											);
																										},
																									)}
																								</Pre>
																							</Collapsible>

																							<Collapsible
																								title="Partidos"
																								className="tw-mb-2"
																								contentClassName="tw-pt-2"
																							>
																								<Block>
																									<Select
																										id="matches-filter"
																										variant={Select.variant.STYLED}
																										onChange={onMatchesFilterChange(team.name)}
																										defaultValue={
																											teamSide === "home" ? "Local" : "Visitante"
																										}
																									>
																										<Select.Option value="Todos">
																											Todos
																										</Select.Option>
																										<Select.Option value="Local">
																											Local
																										</Select.Option>
																										<Select.Option value="Visitante">
																											Visitante
																										</Select.Option>
																										<Select.Option value="Ganados">
																											Ganados
																										</Select.Option>
																										<Select.Option value="Perdidos">
																											Perdidos
																										</Select.Option>
																										<Select.Option value="Empatados">
																											Empatados
																										</Select.Option>
																									</Select>
																								</Block>
																								<Space size={1} />

																								<List
																									variant={List.variant.SIMPLE}
																									className="tw-rounded-md tw-p-2 tw-pt-4 dr-bg-color-surface-200"
																								>
																									{filterMatches(
																										team.matches,
																										team.name,
																										matchesFilters[team.name] ||
																											(teamSide === "home" ? "Local" : "Visitante"),
																									).map((playedMatch) => {
																										const currentTeam =
																											playedMatch.teams.home.name === team.name
																												? playedMatch.teams.home
																												: playedMatch.teams.away;

																										return (
																											<List.Item
																												key={playedMatch.id}
																												className="tw-ml-3 tw-text-base"
																											>
																												<Text>
																													<InlineText className="tw-mr-1 tw-text-xs">
																														{currentTeam.winner === true
																															? "✅"
																															: currentTeam.winner === false
																															? "❌"
																															: "🔳"}{" "}
																													</InlineText>
																													<InlineText>
																														{composePlayedMatchTitle(playedMatch)}
																													</InlineText>
																												</Text>
																												<Text className="tw-mb-4 tw-flex tw-justify-between tw-text-sm">
																													<InlineText className="tw-ml-5 tw-italic">
																														{playedMatch.date}
																													</InlineText>

																													{Number.isInteger(
																														playedMatch.teams.home.standings &&
																															playedMatch.teams.away.standings,
																													) ? (
																														<InlineText>
																															{`Posiciones: [${playedMatch.teams.home.standings}] | [${playedMatch.teams.away.standings}]`}
																														</InlineText>
																													) : null}
																												</Text>
																											</List.Item>
																										);
																									})}
																								</List>
																							</Collapsible>
																						</Block>
																					</Block>
																				);
																			})}
																		</Block>
																	</Collapsible>
																);
															})}
														</Block>
													);
												},
											)}
										</Block>
									</Block>
								);
							})}
						</Collapsible>
					);
				})}
			</MainLayout>
		</Page>
	);
}

export default withAuthRulesPage(BetsPage, { requireAuth: true });

// --- TYPES ---

export type T_BetsPageProps = {
	data: {
		[date in string]: {
			name: string;
			country: string;
			standings: {
				teamId: number;
				teamName: string;
				points: number;
				stats: {
					goalsDiff: number;
					played: number;
					win: number;
					draw: number;
					lose: number;
					goals: {
						for: number;
						against: number;
					};
				};
			}[];
			matches: T_FixtureMatch[];
		}[];
	};
};

type T_FixtureMatch = {
	id: string;
	fullDate: string;
	date: string;
	hour: string;
	predictions: {
		name: string;
		recommendable: boolean;
		acceptancePercentage: number;
		criteria: {
			home: { description: string; check: string }[];
			away: { description: string; check: string }[];
		};
	}[];
	teams: {
		home: {
			id: number;
			name: string;
			score: number | null;
			winner: boolean | null;
			standings: number | null;
			featured: boolean;
			stats: DR.Object<number>;
			matches: T_PlayedMatch[];
		};
		away: {
			id: number;
			name: string;
			score: number | null;
			winner: boolean | null;
			standings: number | null;
			featured: boolean;
			stats: DR.Object<number>;
			matches: T_PlayedMatch[];
		};
	};
};

type T_PlayedMatch = {
	id: string;
	fullDate: string;
	date: string;
	hour: string;
	teams: {
		home: {
			id: number;
			name: string;
			score: number | null;
			winner: boolean | null;
			standings: number | null;
			featured: boolean;
		};
		away: {
			id: number;
			name: string;
			score: number | null;
			winner: boolean | null;
			standings: number | null;
			featured: boolean;
		};
	};
};

type T_FiltersValues = "Todos" | "Local" | "Visitante" | "Ganados" | "Perdidos" | "Empatados";

type T_PlayedMatchesFilters = DR.Object<T_FiltersValues>;
