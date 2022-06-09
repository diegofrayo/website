import * as React from "react";

import { Icon, Link, Title, Block, Text, InlineText } from "~/components/primitive";
import { Emoji, Render } from "~/components/shared";
import { useQuery } from "~/hooks";
import BooksService from "~/services/books";
import type { T_Book, T_ReactElement } from "~/types";

function Books(): T_ReactElement {
  const { isLoading, error, data } = useQuery<T_Book[]>("books", BooksService.fetchBooks);

  return (
    <Render
      isLoading={isLoading}
      error={error}
      data={data}
    >
      {(data) => {
        const books = data as T_Book[];

        return (
          <Block className="dfr-Books tw-flex tw-flex-wrap tw-justify-center sm:tw-justify-between">
            {books.map(({ id, title, calification, author, year, url, cover }) => (
              <Link
                key={id}
                variant={Link.variant.UNSTYLED}
                href={url}
                className="tw-relative tw-mx-2 tw-mb-6 tw-h-64 tw-w-48 tw-overflow-hidden tw-rounded-br-md tw-rounded-tr-md tw-border-l-8 tw-shadow-lg tw-duration-500 dfr-border-color-dark-strong hover:tw-translate-x-1 hover:tw--translate-y-1 hover:tw-rotate-0 hover:tw-opacity-75 hover:tw-shadow-2xl dark:dfr-border-color-primary sm:tw--rotate-1"
                isExternalUrl
              >
                <article
                  className="tw-flex tw-h-full tw-w-full"
                  style={{
                    backgroundImage: `url(${cover})`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <Icon
                    wrapperClassName="tw-absolute tw--top-1 tw--right-1 tw-bg-black dark:tw-bg-white tw-rounded-md tw-shadow-md tw-p-2 tw-w-10 tw-h-10"
                    iconClassName="tw-relative tw-top-0.5 tw--left-0.5"
                    icon={
                      calification === 5
                        ? Icon.icon.STAR
                        : calification === 4
                        ? Icon.icon.HEART
                        : Icon.icon.CHECK
                    }
                    size={24}
                  />

                  <Block className="tw-flex tw-w-full tw-flex-col tw-items-stretch tw-self-end tw-rounded-tr-lg tw-bg-opacity-70 tw-p-2 dfr-bg-color-light-strong">
                    <Title
                      is="h1"
                      variant={Title.variant.UNSTYLED}
                      className="tw-mb-0.5 tw-break-normal tw-uppercase tw-leading-tight tw-text-black"
                    >
                      {title}
                    </Title>
                    <Text className="tw-mb-2 tw-text-sm tw-font-bold tw-capitalize tw-italic tw-leading-none tw-text-gray-700">
                      {author || "Author"}
                    </Text>
                    <Text className="tw-text-right tw-text-xs tw-font-bold tw-leading-none tw-text-black">
                      <Emoji className="tw-mr-1">🗓</Emoji>
                      <InlineText>{year}</InlineText>
                    </Text>
                  </Block>
                </article>
              </Link>
            ))}
          </Block>
        );
      }}
    </Render>
  );
}

export default Books;
