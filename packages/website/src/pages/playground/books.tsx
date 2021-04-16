import React from "react";

import { Icon, Link, Title } from "~/components/primitive";
import { Emoji, Render } from "~/components/pages/_shared";
import PlaygroundPageTemplate from "~/components/pages/playground/PlaygroundPageTemplate";
import { useQuery } from "~/hooks";
import BooksService from "~/services/books";
import { T_Book, T_ReactElement } from "~/types";
import { generateSlug } from "~/utils/strings";

function BooksPage(): T_ReactElement {
  return (
    <PlaygroundPageTemplate pageName="📚 books">
      <Content />
    </PlaygroundPageTemplate>
  );
}

export default BooksPage;

// --- Components ---

function Content(): T_ReactElement {
  const { isLoading, error, data } = useController();

  return (
    <Render isLoading={isLoading} error={error} data={data}>
      {(books: T_Book[]) => {
        return (
          <div className="tw-flex tw-justify-center sm:tw-justify-between tw-flex-wrap">
            {books.map(({ title, calification, author, year, url }, index) => {
              return (
                <Link
                  key={`BooksPage-${index}`}
                  href={url}
                  variant={Link.variant.UNSTYLED}
                  className="book tw-relative tw-w-48 tw-h-64 tw-mb-6 tw-border-l-8 tw-border-black dark:dfr-border-color-primary tw-mx-2 sm:tw-mx-0 tw-rounded-br-md tw-rounded-tr-md tw-overflow-hidden tw-shadow-lg tw-transform tw-duration-300 hover:tw--translate-y-0.5 hover:tw-translate-x-0.5"
                >
                  <article
                    className="tw-flex tw-h-full tw-w-full"
                    style={{
                      backgroundImage: `url(/static/pages/playground/books/${generateSlug(
                        title,
                      )}.jpg)`,
                      backgroundSize: "100% 100%",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <span className="tw-absolute tw--top-2 tw--right-2 tw-bg-black dark:tw-bg-white tw-rounded-full tw-shadow-md tw-p-2 tw-w-10 tw-h-10">
                      <Icon
                        icon={
                          calification === 5
                            ? Icon.icon.STAR
                            : calification === 4
                            ? Icon.icon.HEART
                            : Icon.icon.CHECK
                        }
                        size={24}
                        wrapperClassName="tw-relative tw--left-0.5 tw-top-0.5"
                      />
                    </span>

                    <div className="book__details tw-flex tw-self-end tw-flex-col tw-w-full tw-items-stretch tw-p-2">
                      <Title
                        is="h1"
                        variant={Title.variant.UNSTYLED}
                        className="tw-leading-tight tw-text-black tw-uppercase tw-break-normal tw-mb-2"
                      >
                        {title}
                      </Title>
                      <p className="tw-text-sm tw-font-bold tw-leading-none tw-text-gray-700 tw-capitalize tw-mb-2">
                        {author || "Author"}
                      </p>
                      <p className="tw-text-sm tw-font-bold tw-leading-none tw-text-right tw-text-black">
                        <Emoji className="tw-mr-1">🗓</Emoji>
                        <span>{year}</span>
                      </p>
                    </div>
                  </article>
                </Link>
              );
            })}

            <style jsx>{`
              .book__details {
                background-color: rgba(255, 255, 255, 0.7);
              }
            `}</style>
          </div>
        );
      }}
    </Render>
  );
}

// --- Controller ---

function useController() {
  const { isLoading, error, data } = useQuery("books", BooksService.fetchBooks);

  return { isLoading, error, data };
}
