import * as React from "react";
import jsConvertCase from "js-convert-case";

import { MainLayout, Page } from "~/components/layout";
import {
	Block,
	Collapsible,
	InlineText,
	List,
	Pre,
	Select,
	Space,
	Text,
	Title,
} from "~/components/primitive";
import { withAuthRulesPage } from "~/modules/auth";
import type DR from "@diegofrayo/types";
import { generateSlug } from "@diegofrayo/utils/strings";

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
				return match.teamA.name === teamName;
			});
		}
		if (filter === "Visitante") {
			return matches.filter((match) => {
				return match.teamB.name === teamName;
			});
		}
		if (filter === "Ganados") {
			return matches.filter((match) => {
				return (
					(match.teamA.name === teamName && match.teamA.winner === true) ||
					(match.teamB.name === teamName && match.teamB.winner === true)
				);
			});
		}
		if (filter === "Perdidos") {
			return matches.filter((match) => {
				return (
					(match.teamA.name === teamName && match.teamA.winner === false) ||
					(match.teamB.name === teamName && match.teamB.winner === false)
				);
			});
		}
		if (filter === "Empatados") {
			return matches.filter((match) => {
				return (
					(match.teamA.name === teamName && match.teamA.winner === null) ||
					(match.teamB.name === teamName && match.teamB.winner === null)
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

	function composeMatchTitle(match: T_FixtureMatch) {
		const title = `${match.title} | ${match.hour}`;

		if (match.predictions[0].recommendable) {
			return `${title} 🌟`;
		}

		return title;
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
				width="tw-max-w-screen-lg"
			>
				<Block>
					{Object.entries(data).map(([fixtureDate, leagues]) => {
						return (
							<Block key={fixtureDate}>
								<Block className="tw-text-center">
									<InlineText className="tw-inline-block tw-rounded-md tw-px-2 tw-py-0.5 tw-text-sm tw-font-bold tw-italic dr-text-color-primary-100 dr-bg-color-surface-300">
										{fixtureDate.replace("--", " / ")}
									</InlineText>
								</Block>

								<Space size={2} />

								<Block>
									{Object.entries(leagues).map(([leagueTitle, league]) => {
										if (league.matches.length === 0) {
											return null;
										}

										return (
											<Block
												key={leagueTitle}
												className="tw-mb-8 tw-overflow-auto tw-rounded-md dr-bg-color-surface-200"
											>
												<Title
													is="h2"
													className="tw-p-4 tw-text-center tw-text-2xl tw-text-white dr-bg-color-surface-300"
												>
													{leagueTitle}
												</Title>

												<Block className="tw-p-5">
													<Collapsible title="Posiciones">
														<Pre>
															{league.standings
																.map((team, index) => {
																	return `${index + 1}. ${team.teamName} | ${team.points}`;
																})
																.join("\n")}
														</Pre>
													</Collapsible>
													<Space size={4} />

													{Object.entries(groupMatchesByDate(league.matches)).map(
														([date, matchesGroupedByDate]) => {
															return (
																<Block
																	key={`${leagueTitle}-${date}`}
																	className="tw-mb-8 last:tw-mb-0"
																>
																	<Title
																		is="h3"
																		variant={Title.variant.SIMPLE}
																		className="tw-mb-2 tw-text-2xl tw-text-white tw-underline"
																	>
																		{date}
																	</Title>

																	<Block className="tw-ml-2">
																		{matchesGroupedByDate.map((match) => {
																			return (
																				<Collapsible
																					key={match.title}
																					title={composeMatchTitle(match)}
																					className="tw-mb-2"
																					contentClassName="tw-pt-2"
																				>
																					<Collapsible
																						title="Predicciones de apuestas"
																						contentClassName="tw-pt-0.5"
																					>
																						{match.predictions.map((prediction) => {
																							return (
																								<Block
																									key={generateSlug(
																										`${match.title}-${prediction.name}`,
																									)}
																									className="tw-overflow-hidden tw-rounded-md tw-px-4 tw-py-3 dr-bg-color-surface-300"
																								>
																									<Text className="tw-text-xl tw-font-bold">
																										<InlineText className="tw-underline">
																											{" "}
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
																												Es recomendable:
																											</InlineText>{" "}
																											<InlineText className="tw-text-xs">
																												{prediction.recommendable ? "✅" : "❌"}
																											</InlineText>
																										</Text>
																										<Text>
																											<InlineText is="strong">
																												Porcentaje de aceptacion:
																											</InlineText>{" "}
																											{prediction.acceptancePercentage * 100}%
																										</Text>

																										<Text className="tw-font-bold">Criterios:</Text>
																										<List variant={List.variant.SIMPLE}>
																											{prediction.criteria.home.map((criteria) => {
																												return (
																													<List.Item
																														key={generateSlug(
																															`${match.title}-${criteria.description}`,
																														)}
																														className="tw-text-sm"
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
																					<Space size={1} />

																					<Block className="tw-flex tw-justify-between tw-gap-2">
																						{Object.entries(match.teams).map(
																							([teamName, teamDetails]) => {
																								return (
																									<Block
																										key={teamName}
																										className="tw-w-[50%] tw-flex-shrink-0 tw-overflow-auto tw-rounded-md"
																									>
																										<Block>
																											<Title
																												is="h4"
																												className="tw-p-0.5 tw-text-center dr-bg-color-surface-100"
																											>
																												{teamName}{" "}
																												{Number.isInteger(teamDetails.standing)
																													? `(${teamDetails.standing})`
																													: ""}
																											</Title>

																											<Block className="tw-px-4 tw-pb-1 tw-pt-2 dr-bg-color-surface-300">
																												<Collapsible
																													title="Estadísticas"
																													className="tw-mb-2"
																													contentClassName="tw-pt-1"
																												>
																													<Pre className="tw-w-full tw-max-w-full tw-overflow-auto tw-rounded-md tw-px-4 tw-py-3 tw-text-base dr-bg-color-surface-200">
																														{Object.entries(teamDetails.stats).map(
																															([key, value]) => {
																																if (key.includes("--")) {
																																	return (
																																		<Space
																																			key={key}
																																			size={2}
																																		/>
																																	);
																																}

																																return (
																																	<Text
																																		key={`${match.title}-${key}`}
																																	>
																																		<InlineText is="strong">
																																			-{" "}
																																			{jsConvertCase.toSentenceCase(
																																				key,
																																			)}
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
																															onChange={onMatchesFilterChange(
																																teamName,
																															)}
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
																															teamDetails.matches,
																															teamName,
																															matchesFilters[teamName],
																														).map((historyMatch) => {
																															const currentTeam =
																																historyMatch.teamA.name === teamName
																																	? historyMatch.teamA
																																	: historyMatch.teamB;

																															return (
																																<List.Item
																																	key={`${historyMatch.title}-${historyMatch.date}`}
																																	className="tw-ml-3 tw-text-base"
																																>
																																	<Text>
																																		<InlineText className="tw-mr-1 tw-text-xs">
																																			{currentTeam.winner === true
																																				? "✅"
																																				: currentTeam.winner ===
																																				  false
																																				? "❌"
																																				: "🔳"}{" "}
																																		</InlineText>
																																		<InlineText>
																																			{historyMatch.title}
																																		</InlineText>
																																	</Text>
																																	<Text className="tw-mb-4 tw-flex tw-justify-between tw-text-sm">
																																		<InlineText className="tw-italic">
																																			{historyMatch.date}
																																		</InlineText>

																																		{Number.isInteger(
																																			historyMatch.teamA.standing,
																																		) ? (
																																			<InlineText>
																																				{`Posiciones: ${historyMatch.teamA.standing} | ${historyMatch.teamB.standing}`}
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
																									</Block>
																								);
																							},
																						)}
																					</Block>
																				</Collapsible>
																			);
																		})}
																	</Block>
																</Block>
															);
														},
													)}
												</Block>
											</Block>
										);
									})}
								</Block>
							</Block>
						);
					})}
				</Block>
			</MainLayout>
		</Page>
	);
}

export default withAuthRulesPage(BetsPage, { requireAuth: true });

// --- TYPES ---

export type T_BetsPageProps = {
	data: {
		[date in string]: {
			// Leagues
			[leagueName in string]: {
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
			};
		};
	};
};

type T_FixtureMatch = {
	title: string;
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
	teams: DR.Object<{
		id: number;
		name: string;
		score: number | null;
		winner: boolean | null;
		standing: number | null;
		isHomeTeam: boolean;
		stats: DR.Object<number>;
		matches: T_PlayedMatch[];
	}>;
};

type T_PlayedMatch = {
	title: string;
	fullDate: string;
	date: string;
	hour: string;
	teamA: {
		id: number;
		name: string;
		score: number | null;
		winner: boolean | null;
		standing: number | null;
		isHomeTeam: boolean;
	};
	teamB: {
		id: number;
		name: string;
		score: number | null;
		winner: boolean | null;
		standing: number | null;
		isHomeTeam: boolean;
	};
};

type T_FiltersValues = "Todos" | "Local" | "Visitante" | "Ganados" | "Perdidos" | "Empatados";

type T_PlayedMatchesFilters = DR.Object<T_FiltersValues>;
