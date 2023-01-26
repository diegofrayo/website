import * as React from "react";

import { Icon, Link, Title, Block, Text, InlineText, Image } from "~/@legacy/src/components/primitive";
import { Emoji, Render } from "~/@legacy/src/components/shared";
import { useQuery } from "~/@legacy/src/hooks";
import type { T_ReactElement, T_ReactOnClickEventObject } from "~/@legacy/src/types";

import BooksService, { T_Book } from "./service";

function Books(): T_ReactElement {
	// hooks
	const { isLoading, error, data } = useQuery<T_Book[]>("books", BooksService.fetchBooks);

	// handlers
	function handleBookItemClick(event: T_ReactOnClickEventObject<HTMLDivElement>): void {
		const link = event.currentTarget.querySelector(".title-link") as HTMLLinkElement;

		if (link) {
			link.click();
		} else {
			throw Error("Link does not work");
		}
	}

	return (
		<Render
			isLoading={isLoading}
			error={error}
			data={data}
		>
			{(books): T_ReactElement => {
				return (
					<Block className="dfr-Books tw-flex tw-flex-wrap tw-justify-center sm:tw-justify-between">
						{books.map(({ id, title, calification, author, url, cover, addedDate }) => {
							return (
								<Block
									key={id}
									is="article"
									className="tw-relative tw-mx-2 tw-mb-6 tw-flex tw-h-64 tw-w-48 tw-cursor-pointer tw-overflow-hidden tw-rounded-br-md tw-rounded-tr-md tw-border-l-8 tw-shadow-lg tw-duration-500 dfr-border-color-bw hover:tw-translate-x-1 hover:tw--translate-y-1 hover:tw-rotate-0 hover:tw-opacity-75 hover:tw-shadow-2xl sm:tw--rotate-1"
									onClick={handleBookItemClick}
								>
									<Image
										src={cover}
										alt={title}
										className="tw-z-10"
										fill
									/>
									<Icon
										wrapperClassName="tw-absolute tw--top-1 tw--right-1 dfr-bg-color-bw dark:dfr-bg-color-wb tw-rounded-md tw-shadow-md tw-p-2 tw-w-10 tw-h-10 tw-z-20"
										iconClassName="tw-relative tw-top-0.5 tw--left-0.5"
										icon={
											calification === 5
												? Icon.icon.STAR
												: calification === 4
												? Icon.icon.HEART_SOLID
												: Icon.icon.CHECK
										}
										size={24}
									/>
									<Block className="tw-z-20 tw-flex tw-w-full tw-flex-col tw-items-stretch tw-self-end tw-rounded-tr-lg tw-bg-opacity-70 tw-p-2 dfr-bg-color-bw">
										<Title
											is="h1"
											variant={Title.variant.UNSTYLED}
											className="tw-mb-0.5 tw-break-words tw-uppercase tw-leading-tight dfr-text-color-wb"
										>
											<Link
												variant={Link.variant.UNSTYLED}
												href={url}
												className="title-link"
												isExternalLink
											>
												{title}
											</Link>
										</Title>
										<Text className="tw-mb-4 tw-text-sm tw-font-bold tw-capitalize tw-italic tw-leading-none dfr-text-color-secondary">
											{author}
										</Text>
										<Text className="tw-text-right tw-text-xs tw-font-bold tw-leading-none dfr-text-color-wb">
											<Emoji className="tw-mr-1">🗓</Emoji>
											<InlineText>{addedDate.split("/")[0]}</InlineText>
										</Text>
									</Block>
								</Block>
							);
						})}
					</Block>
				);
			}}
		</Render>
	);
}

export default Books;
