import * as React from "react";
import classNames from "classnames";

import { Button, Icon, Image, Link, Space, Title, Block, Text } from "~/components/primitive";
import { Render } from "~/components/shared";
import { useQuery } from "~/hooks";
import { getScrollPosition, setScrollPosition, isInViewport } from "~/utils/browser";
import { sortBy } from "~/utils/objects-and-arrays";
import { generateSlug } from "~/utils/strings";
import { isEmptyString, isUndefined } from "~/utils/validations";
import type { T_Object, T_ReactElement } from "~/types";

import FilmsService, { T_Film } from "./service";

function Films(): T_ReactElement {
	const {
		// states & refs
		selectedCategory,
		isAddedDateFilterEnabled,

		// vars
		isLoading,
		error,
		data,

		// handlers
		handleSelectFilterClick,
		handleToggleOrderByFilterClick,
	} = useController();

	return (
		<Render
			isLoading={isLoading}
			error={error}
			data={data}
		>
			{(data): T_ReactElement => {
				const { categories, films } = data;

				return (
					<Block>
						<Block is="section">
							<Title
								is="h3"
								size={Title.size.MD}
								variant={Title.variant.SECONDARY}
								className="tw-mb-4"
							>
								Categorías [{categories.length}]
							</Title>
							<Block className="tw-justify-betweden tw-flex tw-flex-wrap">
								{categories.map((category) => {
									return (
										<Button
											key={category}
											variant={Button.variant.SIMPLE}
											className={classNames(
												"tw-underlidne tw-my-1 tw-mr-2 tw-inline-block tw-truncate tw-rounded-md tw-py-1 tw-px-3 tw-text-left tw-text-sm",
												category === selectedCategory
													? "tw-bg-yellow-400 dark:tw-bg-yellow-600"
													: "dfr-bg-color-primary",
											)}
											onClick={handleSelectFilterClick(category)}
										>
											{category}
										</Button>
									);
								})}
							</Block>
						</Block>
						<Space size={6} />

						<Block is="section">
							<Title
								is="h3"
								size={Title.size.MD}
								variant={Title.variant.SECONDARY}
								className="tw-mb-4"
							>
								Ordenar por
							</Title>
							<Block className="tw-justify-betweden tw-flex tw-flex-wrap">
								<Button
									variant={Button.variant.SIMPLE}
									className={classNames(
										"tw-underlidne tw-my-1 tw-mr-2 tw-inline-block tw-truncate tw-rounded-md tw-py-1 tw-px-3 tw-text-left tw-text-sm",
										isAddedDateFilterEnabled
											? "tw-bg-yellow-400 dark:tw-bg-yellow-600"
											: "dfr-bg-color-primary",
									)}
									onClick={handleToggleOrderByFilterClick}
								>
									Fecha
								</Button>
							</Block>
						</Block>
						<Space size={6} />

						<Block is="section">
							<Title
								is="h3"
								size={Title.size.MD}
								variant={Title.variant.SECONDARY}
								className="tw-mb-4"
								id="results"
							>
								{selectedCategory ? `Resultados de "${selectedCategory}"` : "Resultados"} [
								{films.length}]
							</Title>
							<Block className="tw-flex tw-flex-wrap tw-justify-center sm:tw-justify-between">
								{films.map(({ id, source, title, type, calification, cover }, index) => {
									return (
										<Link
											key={id}
											variant={Link.variant.UNSTYLED}
											href={
												source === "Netflix"
													? `https://www.netflix.com/title/${id}`
													: source === "YouTube"
													? `https://www.youtube.com/watch?v=${id}`
													: `https://www.imdb.com/title/${id}`
											}
											className={classNames(
												"tw-relative tw-mx-2 tw-mb-6 tw-h-64 tw-w-48 tw-shadow-lg tw-duration-500 hover:tw--translate-y-1 hover:tw-translate-x-1 hover:tw-rotate-0 hover:tw-opacity-75 hover:tw-shadow-2xl",
												index % 2 === 0 ? "sm:tw-rotate-2" : "sm:tw--rotate-2",
											)}
											isExternalLink
										>
											<article
												className="tw-flex tw-h-full tw-w-full tw-bg-no-repeat"
												style={{
													backgroundImage: `url(${cover})`,
													backgroundSize: "100% 100%",
												}}
											>
												<Icon
													wrapperClassName="tw-absolute tw--top-2 tw--right-2 dfr-bg-color-bw dark:dfr-bg-color-wb tw-rounded-full tw-shadow-md tw-p-1 tw-w-8 tw-h-8"
													icon={
														calification === 5
															? Icon.icon.STAR
															: calification === 4
															? Icon.icon.HEART
															: Icon.icon.CHECK
													}
													size={24}
												/>

												<Block className="tw-flex tw-w-full tw-flex-nowrap tw-items-end tw-justify-between tw-self-end tw-bg-opacity-70 tw-p-2 dfr-bg-color-wb">
													{source === "imdb" ? (
														<Image
															src="/static/images/misc/imdb.png"
															className="tw-h-6 tw-w-6 tw-flex-shrink-0 tw-rounded-full"
															alt="imdb icon"
														/>
													) : source === "Amazon Prime Video" ? (
														<Image
															src="/static/images/misc/amazon-prime-video.png"
															className="tw-h-6 tw-w-6 tw-flex-shrink-0 tw-rounded-full"
															alt="Amazon Prime Video icon"
														/>
													) : (
														<Icon
															icon={source === "Netflix" ? Icon.icon.NETFLIX : Icon.icon.YOUTUBE}
															size={24}
															wrapperClassName="tw-flex-shrink-0"
														/>
													)}

													<Block className="tw-flex-1 tw-text-right">
														<Title
															is="h1"
															variant={Title.variant.UNSTYLED}
															className="tw-mb-2 tw-break-normal tw-uppercase tw-leading-tight dfr-text-color-gs-black"
														>
															{title}
														</Title>
														<Text className="tw-text-sm tw-font-bold tw-lowercase tw-italic tw-leading-none dfr-text-color-gs-700">
															{type}
														</Text>
													</Block>
												</Block>
											</article>
										</Link>
									);
								})}
							</Block>
						</Block>
					</Block>
				);
			}}
		</Render>
	);
}

export default Films;

// --- Controller ---

type T_UseControllerReturn = {
	selectedCategory: string;
	isAddedDateFilterEnabled: boolean;
	isLoading: boolean;
	error: unknown;
	data: T_Data | undefined;
	handleSelectFilterClick: (filter: string) => () => void;
	handleToggleOrderByFilterClick: () => void;
};

function useController(): T_UseControllerReturn {
	// hooks
	const { isLoading, error, data } = useQuery<T_Film[]>("films", FilmsService.fetchFilms);

	// states & refs
	const [isAddedDateFilterEnabled, setIsAddedDateFilterEnabled] = React.useState(true);
	const [selectedCategory, setSelectedCategory] = React.useState("");

	// handlers
	const handleSelectFilterClick: T_UseControllerReturn["handleSelectFilterClick"] =
		function handleSelectFilter(category) {
			return () => {
				setSelectedCategory(category === selectedCategory ? "" : category);

				const resultsTitleElement = document.getElementById("results");
				if (!resultsTitleElement) return;

				if (!isInViewport(resultsTitleElement)) {
					resultsTitleElement.scrollIntoView();
					setTimeout(() => {
						setScrollPosition(getScrollPosition());
					}, 10);
				}
			};
		};

	function handleToggleOrderByFilterClick(): void {
		setIsAddedDateFilterEnabled((currentValue) => !currentValue);
	}

	// utils
	function filterFilms(films: T_Film[], filter: string): T_Film[] {
		if (isEmptyString(filter)) {
			return films;
		}

		return films.filter(
			(film) =>
				filter === film.source.toLowerCase() ||
				filter === film.type.toLowerCase() ||
				film.categories.includes(filter),
		);
	}

	return {
		// states & refs
		selectedCategory,
		isAddedDateFilterEnabled,

		// handlers
		handleSelectFilterClick,
		handleToggleOrderByFilterClick,

		// vars
		isLoading,
		error,
		data: isUndefined(data)
			? data
			: {
					films: filterFilms(data, selectedCategory).sort(
						sortBy(
							isAddedDateFilterEnabled
								? [{ param: "addedDate", order: "desc" }]
								: [
										{ param: "calification", order: "desc" },
										{ param: "title", order: "asc" },
								  ],
						),
					),
					categories: Object.values({
						peliculas: "película",
						series: "serie",
						documentales: "documental",
						serie_documental: "serie documental",
						netflix: "netflix",
						youtube: "youtube",
						amazon_primer_video: "amazon prime video",
					}).concat(
						Object.values(
							data.reduce((result: T_Object<string>, film: T_Film) => {
								const categories = film.categories.reduce((result: T_Object<string>, category) => {
									if (category === "documental") {
										return result;
									}

									return { ...result, [generateSlug(category)]: category };
								}, {});

								return { ...result, ...categories };
							}, {}),
						).sort(),
					),
			  },
	};
}

// --- Types ---

type T_Data = {
	films: T_Film[];
	categories: T_Film["categories"];
};
