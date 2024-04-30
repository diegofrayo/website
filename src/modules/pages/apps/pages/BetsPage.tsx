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

function BetsPage({ data }: T_BetsPageProps) {
	// --- STATES & REFS ---
	const [matchesFilters, setMatchesFilters] = React.useState<T_MatchesFilters>({});

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
	function filterMatches(matches: T_Matches, teamName: string, filter: T_FiltersValues) {
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
					{Object.entries(data).map(([date, leagues]) => {
						return (
							<Block key={date}>
								<Title
									is="h2"
									size={Title.size.MD}
									variant={Title.variant.STYLED}
									className="tw-text-center"
								>
									{date}
								</Title>
								<Space size={2} />

								<Block>
									{Object.entries(leagues).map(([leagueTitle, matches]) => {
										if (matches.length === 0) {
											return null;
										}

										return (
											<Collapsible
												key={leagueTitle}
												title={leagueTitle}
												className="tw-mb-8"
												contentClassName="tw-pt-2"
												opened
											>
												{matches.map((match) => {
													return (
														<Collapsible
															key={match.title}
															title={`${match.title.split("|")[1].trim()} | ${
																match.date.split("T")[1]
															}`}
															className="tw-mb-2"
															contentClassName="tw-pt-2"
														>
															<Collapsible
																title="Predicciones de apuestas"
																contentClassName="tw-pt-0.5"
															>
																<List variant={List.variant.SIMPLE}>
																	{Object.entries(match.predictions).map(([key, value]) => {
																		return (
																			<List.Item key={key}>
																				{key}: {value}
																			</List.Item>
																		);
																	})}
																</List>
															</Collapsible>
															<Space size={1} />

															<Block className="tw-flex tw-justify-between tw-gap-2">
																{Object.entries(match.teams).map(([teamName, teamDetails]) => {
																	return (
																		<Block
																			key={teamName}
																			className="tw-w-[50%] tw-flex-shrink-0"
																		>
																			<Block>
																				<Title
																					is="h3"
																					className="tw-p-0.5 tw-text-center dr-bg-color-surface-200"
																				>
																					{teamName}
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
																										<Text key={`${match.title}-${key}`}>
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
																								onChange={onMatchesFilterChange(teamName)}
																							>
																								<Select.Option value="Todos">Todos</Select.Option>
																								<Select.Option value="Local">Local</Select.Option>
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
																											{currentTeam.winner === true
																												? "✅"
																												: currentTeam.winner === false
																												? "❌"
																												: "🔳"}{" "}
																											{historyMatch.title}
																										</Text>
																										<Text className="tw-mb-2 tw-text-sm tw-italic">
																											{historyMatch.date.split("T")[0]}
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
																})}
															</Block>
														</Collapsible>
													);
												})}
											</Collapsible>
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
				title: string;
				date: string;
				predictions: DR.Object<"Si" | "No">;
				teams: DR.Object<{
					id: number;
					name: string;
					score: number | null;
					winner: boolean | null;
					stats: DR.Object<number>;
					matches: T_Matches;
				}>;
			}[];
		};
	};
};

type T_Matches = {
	title: string;
	date: string;
	teamA: {
		id: number;
		name: string;
		score: number | null;
		winner: boolean | null;
	};
	teamB: {
		id: number;
		name: string;
		score: number | null;
		winner: boolean | null;
	};
}[];

type T_FiltersValues = "Todos" | "Local" | "Visitante" | "Ganados" | "Perdidos" | "Empatados";

type T_MatchesFilters = DR.Object<T_FiltersValues>;
