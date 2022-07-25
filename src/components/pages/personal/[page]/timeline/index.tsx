import * as React from "react";
import classNames from "classnames";

import { Button, Space, Title, Block, Text, InlineText } from "~/components/primitive";
import { Emoji, Render, Timeline } from "~/components/shared";
import { useQuery } from "~/hooks";
import { safeCastNumber } from "~/utils/numbers";
import { isNotUndefined, isUndefined, isNotEmptyString } from "~/utils/validations";
import type { T_ReactElement } from "~/types";

import TimelineService from "./service";
import { T_TimelineCategory, T_TimelineFetchResponse, T_TimelineGroupItem } from "./types";

function TimelinePage(): T_ReactElement {
	const {
		// states & refs
		selectedCategory,

		// vars
		isLoading,
		error,
		data,

		// handlers
		handleSelectFilterClick,
	} = useController();

	return (
		<Render
			isLoading={isLoading}
			error={error}
			data={data}
		>
			{(data): T_ReactElement => {
				const { categories, timeline } = data;

				return (
					<React.Fragment>
						<Block is="section">
							<Title
								is="h3"
								size={Title.size.MD}
								variant={Title.variant.SECONDARY}
								className="tw-mb-4"
							>
								Categorías [{categories.length}]
							</Title>
							<Block className="tw-flex tw-flex-wrap">
								{categories.map((category) => {
									return (
										<Button
											key={category.id}
											variant={Button.variant.SIMPLE}
											className={classNames(
												"tw-my-1 tw-mr-2 tw-inline-block tw-truncate tw-rounded-md tw-py-1 tw-px-3 tw-text-left tw-text-sm tw-font-bold",
												category.id === selectedCategory
													? "tw-bg-yellow-400 dark:tw-bg-yellow-600"
													: "dfr-bg-color-primary",
											)}
											onClick={handleSelectFilterClick(category.id)}
										>
											<Emoji>{category.emoji}</Emoji> {category.value}
										</Button>
									);
								})}
							</Block>
						</Block>
						<Space size={6} />
						<Timeline
							timeline={timeline}
							TimelineItem={TimelineItem}
						/>
					</React.Fragment>
				);
			}}
		</Render>
	);
}

export default TimelinePage;

// --- Controller ---

type T_UseControllerReturn = {
	isLoading: boolean;
	error: unknown;
	data: T_TimelineFetchResponse | undefined;
	selectedCategory: string;
	handleSelectFilterClick: (filter: string) => () => void;
	formatDate: (startDate: string, endDate: string) => string;
};

function useController(): T_UseControllerReturn {
	// hook
	const { isLoading, error, data } = useQuery<T_TimelineFetchResponse>(
		"timeline",
		TimelineService.fetchData,
	);

	// states & refs
	const [selectedCategory, setSelectedCategory] = React.useState("");

	// handlers
	function handleSelectFilterClick(category: string): () => void {
		return () => {
			setSelectedCategory(category === selectedCategory ? "" : category);
		};
	}

	// utils
	const formatDate: T_UseControllerReturn["formatDate"] = function formatDate(startDate, endDate) {
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

		const startDateItems = startDate.split("/");
		const startDateDay = safeCastNumber(startDateItems[2]);
		let output = `${startDateDay ? `${startDateDay} de ` : ""}${
			MONTHS[Number(startDateItems[1]) - 1]
		}`;

		if (endDate && startDate !== endDate) {
			const endDateItems = endDate.split("/");
			const haveStartAndEndDateDifferentYear = startDateItems[0] !== endDateItems[0];

			output += `${haveStartAndEndDateDifferentYear ? ` del ${startDateItems[0]}` : ""} al ${Number(
				endDateItems[2],
			)} de ${MONTHS[Number(endDateItems[1]) - 1]}${
				haveStartAndEndDateDifferentYear ? ` del ${endDateItems[0]}` : ""
			}`;
		}

		return output;
	};

	return {
		// states & refs
		selectedCategory,

		// handlers
		handleSelectFilterClick,

		// utils
		formatDate,

		// vars
		isLoading,
		error,
		data: isUndefined(data)
			? data
			: {
					...data,
					timeline: data.timeline.map((timelineGroup) => {
						return {
							...timelineGroup,
							items: isNotEmptyString(selectedCategory)
								? timelineGroup.items.filter((item) => {
										return isNotUndefined(
											item.categories.find((category) => category.id === selectedCategory),
										);
								  })
								: timelineGroup.items,
						};
					}),
			  },
	};
}

// --- Components ---

function TimelineItem({ data }: { data: unknown }): T_ReactElement {
	// vars
	const timelineGroupItem = data as T_TimelineGroupItem;

	const {
		// handlers
		formatDate,
	} = useController();

	return (
		<Block>
			<Text className="tw-text-sm">
				<Emoji className="tw-mr-2">🗓</Emoji>
				<InlineText>
					{formatDate(timelineGroupItem.startDate, timelineGroupItem.endDate)}
				</InlineText>
			</Text>
			<Text className="tw-my-2 tw-text-xl tw-font-bold">{timelineGroupItem.description}</Text>
			<Block>
				{timelineGroupItem.categories.map((category: T_TimelineCategory) => {
					return (
						<InlineText
							key={category.id}
							className="tw-rounded-md tw-border tw-px-2 tw-py-1 tw-text-xs tw-font-bold dfr-border-color-secondary"
						>
							{category.value}
						</InlineText>
					);
				})}
			</Block>
		</Block>
	);
}
