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
import cn from "~/lib/cn";
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

	function composeMatchTitle(match: T_PlayedMatch | T_FixtureMatch) {
		const title = `${match.teams.home.featured ? "🔰" : ""}${match.teams.home.name} ${
			match.teams.home.score === null ? "" : `(${match.teams.home.score})`
		} - ${match.teams.away.featured ? "🔰" : ""}${match.teams.away.name} ${
			match.teams.away.score === null ? "" : `(${match.teams.away.score})`
		}`;

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
						>
							{leagues.map((league) => {
								const leagueName = `${league.name} (${league.country})`;

								if (league.matches.length === 0) {
									return null;
								}

								return (
									<Collapsible
										key={`${fixtureDate}-${leagueName}`}
										title={
											<Title
												is="h2"
												className="tw-p-2 tw-text-left tw-text-base tw-text-white dr-bg-color-surface-300 lg:tw-text-center lg:tw-text-xl"
											>
												{league.flag} {leagueName}
											</Title>
										}
										className="tw-mb-8 tw-overflow-auto tw-rounded-md dr-bg-color-surface-200"
										contentClassName="tw-p-4"
									>
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
														{matchesGroupedByDate.map((match) => {
															return (
																<Collapsible
																	key={match.id}
																	title={
																		<Title
																			is="h2"
																			className="tw-cursor-pointer tw-px-2 tw-pb-4 tw-pt-3 tw-text-center"
																		>
																			<Text
																				className={cn(
																					checkMatchStarted(match.fullDate)
																						? "tw-text-red-700"
																						: "tw-text-green-700",
																				)}
																			>
																				{composeMatchTitle(match)}
																			</Text>
																			<Text>{match.hour}</Text>
																			<Space size={1} />

																			<Block className="tw-flex tw-items-center tw-justify-center tw-gap-2">
																				{match.predictions.map((prediction) => {
																					return (
																						<Block
																							key={`${match.id}-${prediction.id}`}
																							className={cn(
																								"tw-overflow-hidden tw-rounded-md tw-border tw-bg-black tw-pr-1 dr-border-color-surface-400",
																								prediction.recommendable &&
																									"tw-shadow-sm dr-shadow-color-primary-600",
																							)}
																						>
																							<InlineText className="tw-inline-block tw-px-2 tw-py-1.5 tw-text-sm tw-text-white dr-bg-color-surface-300">
																								{prediction.id}
																							</InlineText>
																							<Block className="tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-px-2 tw-text-xs">
																								<InlineText>
																									{prediction.recommendable ? "🌟" : "👎"}
																								</InlineText>

																								{prediction.right ? (
																									<InlineText>✅</InlineText>
																								) : null}

																								{prediction.fail ? (
																									<InlineText>❌</InlineText>
																								) : null}

																								{prediction.warnings.length > 0 ? (
																									<InlineText>⚠️</InlineText>
																								) : null}
																							</Block>
																						</Block>
																					);
																				})}
																			</Block>
																		</Title>
																	}
																	className="tw-mb-10 tw-rounded-md tw-border tw-border-dashed dr-border-color-surface-300 last:tw-mb-0"
																	contentClassName="tw-py-4 dr-border-color-surface-300 tw-border-t tw-pr-5"
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
																					<Text className="tw-text-lg tw-font-bold">
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

																					<Block>
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
																										className={cn(
																											"tw-ml-3 tw-text-sm",
																											criteria.weight > 0 ? "tw-underline" : "",
																										)}
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

																						{prediction.warnings.length > 0 ? (
																							<React.Fragment>
																								<Text className="tw-font-bold">
																									- Advertencias:
																								</Text>
																								<List variant={List.variant.SIMPLE}>
																									{prediction.warnings.map(
																										(warning, warningIndex) => {
																											return (
																												<List.Item
																													key={generateSlug(
																														`${match.id}-${warningIndex}`,
																													)}
																													className={cn("tw-ml-3 tw-text-sm")}
																												>
																													<InlineText className="tw-mr-2">
																														{warning.description}
																													</InlineText>
																												</List.Item>
																											);
																										},
																									)}
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
																	<Block className="tw-flex tw-flex-wrap tw-justify-between tw-gap-2 lg:tw-flex-nowrap">
																		{Object.entries(match.teams).map(([teamSide, team]) => {
																			return (
																				<Block
																					key={team.name}
																					className="tw-w-full tw-flex-shrink-0 tw-overflow-auto tw-rounded-md lg:tw-w-[49%]"
																				>
																					<Title
																						is="h4"
																						className="tw-relative tw-p-1 tw-text-center dr-bg-color-surface-100"
																					>
																						<InlineText>
																							{team.featured ? "🔰" : ""}
																							{team.name}{" "}
																							{Number.isInteger(team.position)
																								? `[${team.position}]`
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
																							<Pre className="tw-w-full tw-max-w-full tw-overflow-x-auto tw-overflow-y-hidden tw-rounded-md tw-px-4 tw-py-3 tw-text-sm dr-bg-color-surface-200">
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
																											<InlineText is="strong">
																												- {jsConvertCase.toSentenceCase(key)}
																											</InlineText>
																											: {value}
																											{key.includes("porcentaje") ? "%" : ""}
																										</Text>
																									);
																								})}
																							</Pre>
																						</Collapsible>

																						<Collapsible
																							title="Partidos"
																							className="tw-mb-2"
																							contentClassName="tw-pt-2"
																						>
																							<Block>
																								<Select
																									id={`${match.id}-matches-filter-${teamSide}`}
																									variant={Select.variant.STYLED}
																									defaultValue={
																										teamSide === "home" ? "Local" : "Visitante"
																									}
																									onChange={onMatchesFilterChange(team.name)}
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
																											key={`${generateSlug(
																												playedMatch.id + playedMatch.hour,
																											)}`}
																											className="tw-ml-3"
																										>
																											<Text className="lg:tw-truncate">
																												<InlineText className="tw-mr-1 tw-text-xs">
																													{currentTeam.winner === true
																														? "✅"
																														: currentTeam.winner === false
																														? "❌"
																														: "🔳"}{" "}
																												</InlineText>
																												<InlineText>
																													{composeMatchTitle(playedMatch)}
																												</InlineText>
																											</Text>
																											<Text className="tw-mb-4 tw-flex tw-flex-col tw-justify-between tw-text-sm lg:tw-flex-row">
																												<InlineText className="tw-ml-0 tw-italic lg:tw-ml-5">
																													{playedMatch.date}
																												</InlineText>

																												{Number.isInteger(
																													playedMatch.teams.home.position,
																												) &&
																												Number.isInteger(
																													playedMatch.teams.away.position,
																												) ? (
																													<InlineText>
																														{`Posiciones: [${playedMatch.teams.home.position}] | [${playedMatch.teams.away.position}]`}
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
									</Collapsible>
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

type T_FiltersValues = "Todos" | "Local" | "Visitante" | "Ganados" | "Perdidos" | "Empatados";

type T_PlayedMatchesFilters = DR.Object<T_FiltersValues>;

export type T_BetsPageProps = {
	data: {
		[date in string]: {
			name: string;
			country: string;
			flag: string;
			standings: T_LeagueStandings;
			matches: T_FixtureMatch[];
		}[];
	};
};

type T_LeagueStandings = {
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

type T_FixtureMatch = {
	id: string;
	fullDate: string;
	date: string;
	hour: string;
	predictions: {
		id: string;
		name: string;
		acceptancePercentage: number;
		recommendable: boolean;
		right: boolean;
		fail: boolean;
		warnings: {
			description: string;
		}[];
		criteria: {
			home: { description: string; check: string; weight: number }[];
			away: { description: string; check: string; weight: number }[];
		};
	}[];
	teams: {
		home: {
			id: number;
			name: string;
			score: number | null;
			winner: boolean | null;
			position: number | null;
			featured: boolean;
			stats: T_TeamStats;
			matches: T_PlayedMatch[];
		};
		away: {
			id: number;
			name: string;
			score: number | null;
			winner: boolean | null;
			position: number | null;
			featured: boolean;
			stats: T_TeamStats;
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
			score: number;
			winner: boolean | null;
			position: number | null;
			featured: boolean;
		};
		away: {
			id: number;
			name: string;
			score: number;
			winner: boolean | null;
			position: number | null;
			featured: boolean;
		};
	};
};

type T_TeamStats = {
	total_de_partidos: number;
	total_de_goles: number;
	promedio_de_goles: number;
	"---|---": number;
	partidos_de_local: number;
	goles_de_local: number;
	promedio_de_goles_de_local: number;
	partidos_ganados_de_local: number;
	partidos_perdidos_de_local: number;
	partidos_empatados_de_local: number;
	partidos_con_goles_de_local: number;
	porcentaje_de_puntos_ganados_de_local: number;
	"---||---": number;
	partidos_de_visitante: number;
	goles_de_visitante: number;
	promedio_de_goles_de_visitante: number;
	partidos_ganados_de_visitante: number;
	partidos_perdidos_de_visitante: number;
	partidos_empatados_de_visitante: number;
	partidos_con_goles_de_visitante: number;
	porcentaje_de_puntos_ganados_de_visitante: number;
	"---|||---": number;
	ultimos_total_de_partidos: number;
	ultimos_total_de_goles: number;
	ultimos_promedio_de_goles: number;
	"---||||---": number;
	ultimos_partidos_de_local: number;
	ultimos_goles_de_local: number;
	ultimos_promedio_de_goles_de_local: number;
	ultimos_partidos_ganados_de_local: number;
	ultimos_partidos_perdidos_de_local: number;
	ultimos_partidos_empatados_de_local: number;
	ultimos_partidos_con_goles_de_local: number;
	"---|||||---": number;
	ultimos_partidos_de_visitante: number;
	ultimos_goles_de_visitante: number;
	ultimos_promedio_de_goles_de_visitante: number;
	ultimos_partidos_ganados_de_visitante: number;
	ultimos_partidos_perdidos_de_visitante: number;
	ultimos_partidos_empatados_de_visitante: number;
	ultimos_partidos_con_goles_de_visitante: number;
};
