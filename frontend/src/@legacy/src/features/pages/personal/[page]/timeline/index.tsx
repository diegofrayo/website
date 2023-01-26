import * as React from "react";
import classNames from "classnames";

import { Button, Space, Title, Block, Text, InlineText } from "~/@legacy/src/components/primitive";
import { Emoji, Render, Timeline } from "~/@legacy/src/components/shared";
import { useQuery } from "~/@legacy/src/hooks";
import v from "~/@legacy/src/lib/v";
import { safeCastNumber } from "~/@legacy/src/utils/numbers";
import type { T_ReactElement } from "~/@legacy/src/types";

import TimelineService from "./service";
import type { T_TimelineCategory, T_TimelineFetchResponse, T_TimelineGroupItem } from "./types";

function TimelinePage(): T_ReactElement {
	// hook
	const {
		isLoading,
		error,
		data: fetchData,
	} = useQuery<T_TimelineFetchResponse>("timeline", TimelineService.fetchData);

	// states & refs
	const [selectedCategory, setSelectedCategory] = React.useState("");

	// vars
	const data = v.isUndefined(fetchData)
		? fetchData
		: {
				...fetchData,
				timeline: fetchData.timeline.map((timelineGroup) => {
					return {
						...timelineGroup,
						items: v.isNotEmptyString(selectedCategory)
							? timelineGroup.items.filter((item) => {
									return v.exists(
										item.categories.find((category) => category.id === selectedCategory),
									);
							  })
							: timelineGroup.items,
					};
				}),
		  };

	// handlers
	function handleSelectFilterClick(category: string): () => void {
		return () => {
			setSelectedCategory(category === selectedCategory ? "" : category);
		};
	}

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
												"tw-my-1 tw-mr-2 tw-inline-block tw-truncate tw-rounded-md tw-py-1 tw-px-3 tw-text-left tw-text-sm",
												category.id === selectedCategory
													? "tw-bg-yellow-400 tw-font-bold dark:tw-bg-yellow-600 dark:dfr-text-color-gs-white"
													: "dfr-bg-color-tertiary",
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

// --- Components ---

function TimelineItem({ data: timelineGroupItem }: { data: T_TimelineGroupItem }): T_ReactElement {
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
							className="tw-rounded-md tw-border tw-px-2 tw-py-1 tw-text-xs tw-font-bold dfr-border-color-primary"
						>
							{category.value}
						</InlineText>
					);
				})}
			</Block>
		</Block>
	);
}

// --- Utils ---

function formatDate(startDate: string, endDate: string): string {
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
}
