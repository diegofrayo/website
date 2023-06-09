import * as React from "react";
import classNames from "classnames";

import { Page, MainLayout } from "~/components/layout";
import { Block, InlineText, Link, List, Text } from "~/components/primitive";
import v from "~/lib/v";
import { getObjectKeys, sortBy } from "~/utils/objects-and-arrays";
import { generateSlug } from "~/utils/strings";
import type { T_Object, T_ReactElement } from "~/types";

type T_BookmarksProps = {
	data: {
		categoryColors: string[];
		bookmarks: T_Object<T_Bookmark[]>;
	};
};

function Bookmarks({ data }: T_BookmarksProps): T_ReactElement {
	// --- VARS ---
	const PAGE_TITLE = "Bookmarks";
	const { parsedBookmarks, categoryColors } = parseBookmarks(data);

	// --- UTILS ---
	function parseBookmarks(data: T_BookmarksProps["data"]): {
		parsedBookmarks: T_BookmarkWithCategory[];
		categoryColors: T_Object<string>;
	} {
		return {
			parsedBookmarks: Object.entries(data.bookmarks)
				.reduce((result: T_BookmarkWithCategory[], [bookmarkCategory, bookmarkItems]) => {
					return result.concat(
						bookmarkItems.map((bookmark: T_Bookmark): T_BookmarkWithCategory => {
							return {
								...bookmark,
								category: bookmarkCategory,
							};
						}),
					);
				}, [])
				.sort(sortBy("-starred", "-date", "title")),
			categoryColors: getObjectKeys(data.bookmarks).reduce((result, category, index) => {
				return {
					...result,
					[category]: data.categoryColors[index],
				};
			}, {}),
		};
	}

	return (
		<Page config={{ title: PAGE_TITLE }}>
			<MainLayout title={PAGE_TITLE}>
				<List variant={List.variant.DEFAULT}>
					{parsedBookmarks.map((bookmark) => {
						return (
							<List.Item
								key={generateSlug(bookmark.title)}
								className={classNames(
									"tw-p-1 tw-pt-0",
									bookmark.starred &&
										"tw-border tw-border-dotted tw-border-amber-500 tw-bg-amber-50 dark:tw-border-amber-800 dark:tw-bg-amber-900",
								)}
							>
								<Link
									variant={Link.variant.PRIMARY}
									href={bookmark.url}
									isExternalLink
								>
									{bookmark.title}
								</Link>
								<Text className="tw-text-xs tw-font-bold tw-italic dfr-text-color-bw">
									{new URL(bookmark.url).host}
									{v.isNotEmptyString(bookmark.author) ? ` | ${bookmark.author}` : ""}
								</Text>
								<Block>
									<InlineText
										className={classNames(
											"tw-inline-block tw-rounded-md tw-px-2 tw-py-0.5 tw-text-xs tw-font-bold dfr-text-color-gs-white",
											categoryColors[bookmark.category],
										)}
									>
										{generateSlug(bookmark.category)}
									</InlineText>
									<InlineText className="tw-mx-1">|</InlineText>
									<InlineText className="tw-inline-block tw-rounded-md tw-px-2 tw-py-0.5 tw-text-xs tw-font-bold dfr-text-color-gs-white dfr-bg-color-gs-black dark:dfr-bg-color-tertiary">
										{bookmark.date}
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

export default Bookmarks;

// --- TYPES ---

type T_Bookmark = {
	url: string;
	title: string;
	date: string;
	starred: boolean;
	author?: string;
};

type T_BookmarkWithCategory = T_Bookmark & { category: string };
