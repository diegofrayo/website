import * as React from "react";
import cn from "classnames";

import { MainLayout, Page } from "~/components/layout";
import { Button, Space, Text, InlineText, Title, Block } from "~/components/primitive";
import { BoxWithTitle, Render } from "~/components/shared";
import { useAsync } from "@diegofrayo/hooks";
import ServerAPI from "~/modules/api";
import { withAuthRulesPage } from "~/modules/auth";
import { sortBy } from "@diegofrayo/sort";
import type DR from "@diegofrayo/types";
import { generateSlug } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";

function TimelinePage() {
	// --- HOOKS ---
	const { isLoading, error, data: rawData } = useAsync("/timeline", TimelineAPI.fetch);

	// --- STATES & REFS ---
	const [selectedCategory, setSelectedCategory] = React.useState("");

	// --- VARS ---
	const data = v.isUndefined(rawData)
		? rawData
		: {
				...rawData,
				groups: rawData.groups.map((group) => {
					return {
						...group,
						items: v.isNotEmptyString(selectedCategory)
							? group.items.filter((item) => {
									return item.categories.includes(selectedCategory);
								})
							: group.items,
					};
				}),
			};

	// --- HANDLERS ---
	function handleSelectFilterClick(category: string): () => void {
		return () => {
			setSelectedCategory(category === selectedCategory ? "" : category);
		};
	}

	return (
		<Page
			config={{
				title: "Timeline",
				disableSEO: true,
			}}
		>
			<MainLayout title="Timeline">
				<Render
					isLoading={isLoading}
					error={error}
					data={data}
				>
					{(data) => {
						const { categories, groups } = data;

						return (
							<React.Fragment>
								<BoxWithTitle
									title={`Categorías [${categories.length}]`}
									className="tw-flex tw-flex-wrap tw-p-4 tw-pt-5"
								>
									{categories.map((category) => {
										return (
											<Button
												key={category.id}
												variant={Button.variant.SIMPLE}
												className={cn(
													"tw-my-1 tw-mr-2 tw-inline-block tw-truncate tw-rounded-md tw-px-3 tw-py-1 tw-text-left tw-text-sm tw-capitalize",
													category.id === selectedCategory
														? "tw-bg-yellow-400 tw-font-bold tw-text-yellow-700"
														: "dr-bg-color-surface-200",
												)}
												onClick={handleSelectFilterClick(category.id)}
											>
												<InlineText>{category.emoji}</InlineText> {category.value}
											</Button>
										);
									})}
								</BoxWithTitle>
								<Space size={6} />

								<Timeline
									data={groups}
									TimelineItemComponent={TimelineItem}
								/>
							</React.Fragment>
						);
					}}
				</Render>
			</MainLayout>
		</Page>
	);
}

export default withAuthRulesPage(TimelinePage, {
	requireAuth: true,
	requireRemoteSecurityPin: true,
});

// --- API ---

const TimelineAPI = {
	fetch: () => {
		return ServerAPI.post<T_TimelineRawResponse>("/data", { model: "timeline" }).then(
			(response) => {
				const { data } = response;

				return {
					categories: data.categories,
					groups: Object.values(
						data.items.reduce((result: DR.Object<T_TimelineGroup>, item) => {
							const year = item.start_date.split("/")[0];
							const newResult = { ...result };

							if (v.isUndefined(result[year])) {
								newResult[year] = {
									title: year,
									items: [],
								};
							}

							newResult[year].items.push(item);
							newResult[year].items.sort(sortBy("-start_date"));

							return newResult;
						}, {}),
					).sort(sortBy("-title")),
				};
			},
		);
	},
};

// --- TYPES ---

type T_TimelineRawResponse = {
	categories: {
		id: string;
		value: string;
		emoji: string;
	}[];
	items: T_TimelineItem[];
};

type T_TimelineGroup = {
	title: string;
	items: T_TimelineRawResponse["items"];
};

type T_TimelineItem = {
	id: string;
	start_date: string;
	end_date: string;
	description: string;
	categories: string[];
};

// --- COMPONENTS ---

function TimelineItem({ data: timelineGroupItem }: { data: T_TimelineItem }) {
	return (
		<Block>
			<Text className="tw-text-sm">
				<InlineText className="tw-mr-2">🗓</InlineText>
				<InlineText>
					{formatDate(timelineGroupItem.start_date, timelineGroupItem.end_date)}
				</InlineText>
			</Text>
			<Text className="tw-my-2 tw-text-xl tw-font-bold">{timelineGroupItem.description}</Text>
			<Block>
				{timelineGroupItem.categories.map((category) => {
					return (
						<InlineText
							key={generateSlug(`${timelineGroupItem.id}-${category}`)}
							className="tw-rounded-md tw-border tw-px-2 tw-py-1 tw-text-xs tw-font-bold tw-capitalize dr-border-color-surface-300"
						>
							{category}
						</InlineText>
					);
				})}
			</Block>
		</Block>
	);
}

type T_TimelineProps<G_Item> = {
	data: {
		title: string;
		items: G_Item[];
	}[];
	TimelineItemComponent: DR.React.FunctionComponent<{ data: G_Item }>;
};

function Timeline<G_Item extends { id: string; [key: string]: unknown }>({
	data,
	TimelineItemComponent,
}: T_TimelineProps<G_Item>) {
	let itemsCounter = 0;

	return (
		<Block>
			{data.map((group, groupIndex) => {
				const groupTitle = group.title;

				return (
					<Block
						key={generateSlug(groupTitle)}
						is="section"
					>
						<Title
							is="h2"
							className="tw-my-8 tw-text-center tw-text-white tw-underline"
							size={Title.size.LG}
						>
							{groupTitle}
						</Title>

						{group.items.map((item, itemIndex) => {
							itemsCounter += 1;
							const isFirstItem = itemIndex === 0;
							const isLastGroup = groupIndex === data.length - 1;
							const isLastGroupItem = itemIndex === group.items.length - 1;
							const renderLastSeparator = !isLastGroup || !isLastGroupItem;

							return (
								<Block
									key={`${generateSlug(groupTitle)}-${item.id}`}
									className={cn(
										"tw-relative tw-px-0 tw-pb-6 tw-text-center dr-border-color-surface-300 last:tw-pb-0 sm:tw-w-1/2 sm:tw-px-4 sm:tw-pb-16",
										itemsCounter % 2 === 0
											? "sm:tw-left-2/4 sm:tw-border-l-4 sm:tw-text-left"
											: "sm:tw-ml-1 sm:tw-border-r-4 sm:tw-text-right",
									)}
								>
									{isFirstItem ? (
										<Block className="tw-mx-auto tw-mb-6 tw-block tw-h-24 tw-w-1 dr-bg-color-surface-300 sm:tw-hidden" />
									) : null}

									<TimelineItemComponent data={item} />

									{renderLastSeparator ? (
										<Block className="tw-mx-auto tw-mt-8 tw-block tw-h-24 tw-w-1 dr-bg-color-surface-300 sm:tw-hidden" />
									) : null}
								</Block>
							);
						})}
					</Block>
				);
			})}
		</Block>
	);
}

// --- UTILS ---

function formatDate(startDate: string, endDate: string) {
	const MONTHS = [
		"enero",
		"febrero",
		"marzo",
		"abril",
		"mayo",
		"junio",
		"julio",
		"agosto",
		"septiembre",
		"octubre",
		"noviembre",
		"diciembre",
	];
	const [startDateYear, startDateMonth, startDateDay] = startDate.split("/");

	let output = `${startDateDay ? `${startDateDay} de ` : ""}${MONTHS[Number(startDateMonth) - 1]}`;

	if (endDate && startDate !== endDate) {
		const [endDateYear, endDateMonth, endDateDay] = endDate.split("/");
		const haveStartAndEndDateDifferentYear = endDateYear !== startDateYear;

		output += `${haveStartAndEndDateDifferentYear ? ` del ${startDateYear}` : ""} al ${Number(
			endDateDay,
		)} de ${MONTHS[Number(endDateMonth) - 1]}${
			haveStartAndEndDateDifferentYear ? ` del ${endDateYear}` : ""
		}`;
	}

	return output;
}
