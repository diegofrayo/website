import * as React from "react";

import { MainLayout, Page } from "~/components/layout";
import { Icon, Link, Title, Block, Text, InlineText, Image } from "~/components/primitive";
import { Render } from "~/components/shared";
import ServerAPI from "~/modules/api";
import { withAuthRulesPage } from "~/modules/auth";
import { useAsync } from "@diegofrayo/hooks";
import { sortBy } from "@diegofrayo/sort";
import type DR from "@diegofrayo/types";

function BooksPage() {
	// --- HOOKS ---
	const { data, isLoading, error } = useAsync("/books", BooksAPI.fetch);

	// --- HANDLERS ---
	function handleBookItemClick(event: DR.React.Events.OnClickEvent<HTMLDivElement>): void {
		const link = event.currentTarget.querySelector("a");

		if (link) {
			link.click();
		} else {
			throw Error("Link does not work");
		}
	}

	return (
		<Page
			config={{
				title: "Books",
				disableSEO: true,
			}}
		>
			<MainLayout title="Books">
				<Render
					data={data}
					isLoading={isLoading}
					error={error}
				>
					{(books) => {
						return (
							<Block className="tw-flex tw-flex-wrap tw-justify-center sm:tw-justify-between">
								{books.map(
									({ id, title, calification, author, url, cover, added_date: addedDate }) => {
										return (
											<Block
												key={id}
												is="article"
												className="tw-relative tw-mx-2 tw-mb-6 tw-flex tw-h-64 tw-w-48 tw-cursor-pointer tw-overflow-hidden tw-rounded-br-md tw-rounded-tr-md tw-border-l-8 tw-shadow-md tw-duration-500 dr-shadow-color-surface-200 dr-border-color-surface-300 hover:tw-opacity-75"
												onClick={handleBookItemClick}
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
													size={24}
												/>
												<Block className="tw-z-20 tw-flex tw-w-full tw-flex-col tw-items-stretch tw-self-end tw-rounded-tr-lg tw-bg-opacity-90 tw-p-2 dr-bg-color-surface-300">
													<Title
														is="h1"
														variant={Title.variant.UNSTYLED}
														className="tw-mb-0.5 tw-break-words tw-uppercase tw-leading-tight tw-text-white"
													>
														<Link
															variant={Link.variant.UNSTYLED}
															href={url}
															isExternalLink
														>
															{title}
														</Link>
													</Title>
													<Text className="tw-mb-4 tw-text-sm tw-font-bold tw-capitalize tw-italic tw-leading-none">
														{author}
													</Text>
													<Text className="tw-text-right tw-text-xs tw-font-bold tw-leading-none">
														<InlineText className="tw-mr-1">🗓</InlineText>
														<InlineText>{addedDate.split("/")[0]}</InlineText>
													</Text>
												</Block>
											</Block>
										);
									},
								)}
							</Block>
						);
					}}
				</Render>
			</MainLayout>
		</Page>
	);
}

export default withAuthRulesPage(BooksPage, { requireAuth: true, requirePin: true });

// --- API ---

const BooksAPI = {
	fetch: () => {
		return ServerAPI.post<T_BooksResponse>("/data", { model: "books" }).then((response) => {
			return response.data.sort(sortBy("-added_date", "-calification", "title"));
		});
	},
};

// --- TYPES ---

type T_BooksResponse = T_Book[];

type T_Book = {
	id: string;
	title: string;
	author: string;
	year: number;
	calification: number;
	added_date: string;
	url: string;
	cover: string;
	is_public: boolean;
};
