import * as React from "react";
import cn from "classnames";

import { MainLayout, Page } from "~/components/layout";
import { Icon, Link, Title, Block, Text, Image, Button, Space } from "~/components/primitive";
import { BoxWithTitle, Render } from "~/components/shared";
import { useAsync } from "@diegofrayo/hooks";
import ServerAPI from "~/modules/api";
import { withAuthRulesPage } from "~/modules/auth";
import { sortBy } from "@diegofrayo/sort";
import type DR from "@diegofrayo/types";
import {
	getScrollPosition,
	isElementInViewport,
	setScrollPosition,
} from "@diegofrayo/utils/browser";
import { throwError } from "@diegofrayo/utils/misc";
import { generateSlug } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";

function FilmsPage() {
	// --- HOOKS ---
	const { data: rawData, isLoading, error } = useAsync("/films", FilmsAPI.fetch);

	// --- STATES & REFS ---
	const [isAddedDateFilterEnabled, setIsAddedDateFilterEnabled] = React.useState(true);
	const [selectedCategory, setSelectedCategory] = React.useState("");

	// --- VARS ---
	const data = v.isUndefined(rawData)
		? rawData
		: {
				films: filterFilms(rawData, selectedCategory).sort(
					isAddedDateFilterEnabled ? sortBy("-added_date") : sortBy("-calification", "title"),
				),
				categories: generateCategories(rawData),
			};

	// --- HANDLERS ---
	function handleSelectFilterClick(category: string) {
		return () => {
			setSelectedCategory(category === selectedCategory ? "" : category);

			const resultsTitleElement = document.getElementById("title-results");
			if (!resultsTitleElement) return;

			if (!isElementInViewport(resultsTitleElement)) {
				resultsTitleElement.scrollIntoView();
				setTimeout(() => {
					setScrollPosition(getScrollPosition());
				}, 10);
			}
		};
	}

	function handleFilmItemClick(event: DR.React.Events.OnClickEvent<HTMLDivElement>) {
		const link = event.currentTarget.querySelector("a");

		if (link) {
			link.click();
		} else {
			throw Error("Link does not work");
		}
	}

	function handleToggleOrderByFilterClick() {
		setIsAddedDateFilterEnabled((currentValue) => !currentValue);
	}

	// --- UTILS ---
	function filterFilms(films: T_Film[], filter: string): T_Film[] {
		if (v.isEmptyString(filter)) {
			return films;
		}

		return films.filter(
			(film) =>
				filter === film.source.toLowerCase() ||
				filter === film.type.toLowerCase() ||
				film.categories.includes(filter),
		);
	}

	function generateCategories(data: T_FilmsResponse) {
		const categories = {
			pelicula: "película",
			serie: "serie",
			documental: "documental",
			serie_documental: "serie documental",
			netflix: "netflix",
			youtube: "youtube",
			amazon_prime_video: "amazon prime video",
			star_plus: "star+",
		};

		const generatedCategories = Object.values(
			data.reduce((result: DR.Object<string>, film) => {
				return {
					...result,
					...film.categories.reduce((result: DR.Object<string>, category) => {
						if (category.includes("documental")) {
							return result;
						}

						return {
							...result,
							[generateSlug(category)]: category,
						};
					}, {}),
				};
			}, {}),
		).sort();

		return Object.values(categories).concat(generatedCategories);
	}

	return (
		<Page
			config={{
				title: "Films",
				disableSEO: true,
			}}
		>
			<MainLayout title="Films">
				<Render
					isLoading={isLoading}
					error={error}
					data={data}
				>
					{(data) => {
						const { categories, films } = data;

						return (
							<Block>
								<BoxWithTitle
									title="Filtros"
									className="tw-p-4 tw-pt-5"
								>
									<Block is="section">
										<Title is="h3">Categorías [{categories.length}]</Title>
										<Space size={0.5} />
										<Block className="tw-justify-betweden tw-flex tw-flex-wrap">
											{categories.map((category) => {
												return (
													<Button
														key={category}
														variant={Button.variant.SIMPLE}
														className={cn(
															"tw-my-1 tw-mr-2 tw-inline-block tw-truncate tw-rounded-md tw-px-3 tw-py-1 tw-text-left tw-text-sm tw-capitalize",
															category === selectedCategory
																? "tw-bg-yellow-400 tw-font-bold tw-text-yellow-700"
																: "dr-bg-color-surface-200",
														)}
														onClick={handleSelectFilterClick(category)}
													>
														{category}
													</Button>
												);
											})}
										</Block>
									</Block>
									<Space size={3} />

									<Block is="section">
										<Title is="h3">Ordenar por</Title>
										<Space size={0.5} />
										<Block className="tw-flex tw-flex-wrap">
											<Button
												variant={Button.variant.SIMPLE}
												className={cn(
													"tw-my-1 tw-mr-2 tw-inline-block tw-truncate tw-rounded-md tw-px-3 tw-py-1 tw-text-left tw-text-sm tw-capitalize",
													isAddedDateFilterEnabled
														? "tw-bg-yellow-400 tw-font-bold tw-text-yellow-700"
														: "dr-bg-color-surface-200",
												)}
												onClick={handleToggleOrderByFilterClick}
											>
												Fecha
											</Button>
										</Block>
									</Block>
								</BoxWithTitle>
								<Space size={6} />

								<Block is="section">
									<Title
										is="h3"
										size={Title.size.MD}
										className="tw-mb-4"
										id="title-results"
									>
										{selectedCategory ? `Resultados de "${selectedCategory}"` : "Resultados"} [
										{films.length}]
									</Title>
									<Block className="tw-flex tw-flex-wrap tw-justify-center sm:tw-justify-between">
										{films.map(({ id, source, title, type, calification, cover, url }, index) => {
											return (
												<Block
													key={id}
													is="article"
													className={cn(
														"tw-relative tw-mx-2 tw-mb-6 tw-flex tw-h-64 tw-w-48 tw-cursor-pointer tw-shadow-lg tw-duration-500 hover:tw--translate-y-1 hover:tw-translate-x-1 hover:tw-rotate-0 hover:tw-opacity-75 hover:tw-shadow-2xl",
														index % 2 === 0 ? "sm:tw-rotate-2" : "sm:tw--rotate-2",
													)}
													onClick={handleFilmItemClick}
												>
													<Image
														src={cover}
														alt={title}
														className="tw-z-10"
														fill
													/>
													<Icon
														wrapperClassName="tw-absolute tw--top-1 tw--right-1 tw-rounded-md tw-p-2 tw-w-10 tw-h-10 tw-z-20 tw-bg-opacity-90 dr-bg-color-surface-100"
														iconClassName="tw-relative tw-top-0.5 tw--left-0.5"
														icon={
															calification === 5
																? Icon.icon.STAR_SOLID
																: calification === 4
																	? Icon.icon.HEART_SOLID
																	: Icon.icon.CHECK
														}
														size={18}
													/>

													<Block className="tw-z-20 tw-flex tw-w-full tw-flex-nowrap tw-items-end tw-justify-between tw-self-end tw-bg-opacity-90 tw-p-2 dr-bg-color-surface-100">
														{source === "imdb" ? (
															<Image
																src="/assets/images/pages/apps/films/imdb.jpg"
																alt="imdb icon"
																className="tw-flex-shrink-0 tw-rounded-full"
																width={24}
																height={24}
															/>
														) : source === "Amazon Prime Video" ? (
															<Image
																src="/assets/images/pages/apps/films/amazon-prime-video.jpg"
																alt="Amazon Prime Video icon"
																className="tw-flex-shrink-0 tw-rounded-full"
																width={24}
																height={24}
															/>
														) : source === "Netflix" ? (
															<Image
																src="/assets/images/pages/apps/films/netflix.svg"
																alt="Netflix icon"
																className="tw-flex-shrink-0 tw-rounded-full"
																width={24}
																height={24}
															/>
														) : source === "Star+" ? (
															<Image
																src="/assets/images/pages/apps/films/star-plus.jpg"
																alt="Star+ icon"
																className="tw-flex-shrink-0 tw-rounded-full"
																width={24}
																height={24}
															/>
														) : (
															<Icon
																icon={Icon.icon.YOUTUBE}
																size={24}
																wrapperClassName="tw-flex-shrink-0"
															/>
														)}

														<Block className="tw-z-20 tw-flex-1 tw-text-right">
															<Title
																is="h1"
																variant={Title.variant.UNSTYLED}
																className="tw-mb-2 tw-break-words tw-uppercase tw-leading-tight tw-text-white"
															>
																<Link
																	variant={Link.variant.UNSTYLED}
																	href={
																		source === "Netflix"
																			? `https://www.netflix.com/title/${id}`
																			: source === "YouTube"
																				? `https://www.youtube.com/watch?v=${id}`
																				: source === "imdb"
																					? `https://www.imdb.com/title/${id}`
																					: source === "Amazon Prime Video"
																						? `https://www.primevideo.com/detail/${id}`
																						: url ||
																							throwError(`Invalid film (${id}) url and source`)
																	}
																	className="title-link"
																	isExternalLink
																>
																	{title}
																</Link>
															</Title>
															<Text className="tw-text-sm tw-font-bold tw-capitalize tw-italic tw-leading-none">
																{type}
															</Text>
														</Block>
													</Block>
												</Block>
											);
										})}
									</Block>
								</Block>
							</Block>
						);
					}}
				</Render>
			</MainLayout>
		</Page>
	);
}

export default withAuthRulesPage(FilmsPage, { requireAuth: true, requireSecurityPin: true });

// --- API ---

const FilmsAPI = {
	fetch: () => {
		return ServerAPI.post<T_FilmsResponse>("/data", { model: "films" }).then((response) => {
			return response.data
				.map((film) => {
					return {
						...film,
						categories: film.categories || [],
					};
				})
				.sort(sortBy("-added_date", "-calification", "title"));
		});
	},
};

// --- TYPES ---

type T_FilmsResponse = T_Film[];

type T_Film = {
	id: string;
	title: string;
	type: "Serie" | "Película" | "Documental" | "Serie documental";
	source: "Netflix" | "YouTube" | "imdb" | "Amazon Prime Video" | "Star+";
	categories: string[];
	calification: number;
	cover: string;
	added_date: string;
	is_public: boolean;
	url?: string;
};
