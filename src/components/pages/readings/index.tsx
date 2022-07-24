import * as React from "react";
import classNames from "classnames";

import { Page, MainLayout } from "~/components/layout";
import { Block, InlineText, Link, List, Text } from "~/components/primitive";
import { Emoji } from "~/components/shared";
import { withAuthenticationRequired } from "~/hocs";
import { sortBy } from "~/utils/objects-and-arrays";
import { generateSlug } from "~/utils/strings";
import { isNotEmptyString } from "~/utils/validations";
import type { T_Object, T_ReactElement } from "~/types";

type T_ReadingsProps = {
	data: {
		categoryColors: string[];
		readings: T_Object<T_Reading[]>;
	};
};

function Readings({ data }: T_ReadingsProps): T_ReactElement {
	// vars
	const PAGE_TITLE = "Readings";
	const { parsedReadings, categoryColors } = parseReadings(data);

	// utils
	function parseReadings(data: T_ReadingsProps["data"]): {
		parsedReadings: T_ReadingWithCategory[];
		categoryColors: T_Object<string>;
	} {
		return {
			parsedReadings: Object.entries(data.readings)
				.reduce((result: T_ReadingWithCategory[], [readingCategory, readingItems]) => {
					return result.concat(
						readingItems.map((reading: T_Reading): T_ReadingWithCategory => {
							return {
								...reading,
								category: readingCategory,
							};
						}),
					);
				}, [])
				.sort(
					sortBy([
						{ param: "starred", order: "desc" },
						{ param: "date", order: "desc" },
						{ param: "title", order: "asc" },
					]),
				),
			categoryColors: Object.keys(data.readings).reduce((result, category, index) => {
				return {
					...result,
					[category]: data.categoryColors[index],
				};
			}, {}),
		};
	}

	// render
	return (
		<Page config={{ title: PAGE_TITLE }}>
			<MainLayout title={PAGE_TITLE}>
				<List variant={List.variant.DEFAULT}>
					{parsedReadings.map((reading) => {
						return (
							<List.Item
								key={generateSlug(reading.title)}
								className={classNames(
									"tw-p-1 tw-pt-0",
									reading.starred &&
										"tw-border tw-border-dotted tw-border-amber-300 tw-bg-amber-100 dark:tw-border-amber-700 dark:tw-bg-amber-900",
								)}
							>
								<Link
									variant={Link.variant.PRIMARY}
									href={reading.url}
									isExternalLink
								>
									{reading.title}
								</Link>
								<Text className="tw-text-xs tw-font-bold tw-italic dfr-text-color-secondary-inv">
									{new URL(reading.url).host}
									{isNotEmptyString(reading.author) ? ` | ${reading.author}` : ""}
								</Text>
								<Block>
									<DoneMark done={reading.done} />
									<InlineText
										className={classNames(
											"tw-inline-block tw-rounded-md tw-px-2 tw-py-0.5 tw-text-xs tw-font-bold dfr-text-color-white-pin",
											categoryColors[reading.category],
										)}
									>
										{generateSlug(reading.category)}
									</InlineText>
									<InlineText className="tw-mx-1">|</InlineText>
									<InlineText className="tw-inline-block tw-rounded-md tw-bg-gray-500 tw-px-2 tw-py-0.5 tw-text-xs tw-font-bold dfr-text-color-white-pin">
										{reading.date}
									</InlineText>
								</Block>
							</List.Item>
						);
					})}
				</List>
			</MainLayout>
		</Page>
	);
}

export default Readings;

// --- Components ---

const DoneMark = withAuthenticationRequired(function DoneMark({
	done,
}: Pick<T_Reading, "done">): T_ReactElement {
	return (
		<React.Fragment>
			<Emoji className="tw-text-xs">{done ? "✅" : "❌"}</Emoji>
			<InlineText className="tw-mx-1">|</InlineText>
		</React.Fragment>
	);
});

// --- Types ---

type T_Reading = {
	url: string;
	title: string;
	date: string;
	done: boolean;
	starred: boolean;
	author?: string;
};

type T_ReadingWithCategory = T_Reading & { category: string };
