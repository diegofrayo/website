import React from "react";

import { Icon, Link, Title } from "~/components/primitive";
import { Render } from "~/components/pages/_shared";
import PlaygroundPageTemplate from "~/components/pages/playground/PlaygroundPageTemplate";
import { useQuery } from "~/hooks";
import BooksService from "~/services/books";
import { T_Book, T_ReactElement } from "~/types";
import { generateSlug } from "~/utils/strings";

function BooksPage(): T_ReactElement {
  return (
    <PlaygroundPageTemplate pageName="books">
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
            {books.map(({ title, calification, url }, index) => {
              return (
                <Link
                  key={`BooksPage-${index}`}
                  href={url}
                  variant={Link.variant.UNSTYLED}
                  className="book tw-relative tw-w-48 tw-h-64 tw-mb-6 tw-borderd dfr-border-color-primary dark:dfr-border-color-primary tw-mx-2 sm:tw-mx-0 tw-rounded-bl-md tw-rounded-tr-md tw-overflow-hidden tw-shadow-lg"
                >
                  <article
                    className="tw-flex tw-h-full tw-w-full"
                    style={{
                      backgroundImage: `url(/static/pages/playground/books/${generateSlug(
                        title,
                      )}.jpg)`,
                      backgroundSize: "100%",
                    }}
                  >
                    <span className="tw-absolute tw-top-1 tw-right-1">
                      {calification === 5 ? (
                        <Icon icon={Icon.icon.STAR} size={32} />
                      ) : calification === 4 ? (
                        <Icon icon={Icon.icon.HEART} size={24} />
                      ) : (
                        <Icon icon={Icon.icon.CHECK} size={16} />
                      )}
                    </span>

                    <div className="book__details tw-flex tw-self-end tw-flex-nowrap tw-justify-end tw-w-full tw-items-end tw-p-2">
                      <Title
                        is="h1"
                        variant={Title.variant.UNSTYLED}
                        className="tw-leading-tight tw-text-black"
                      >
                        {title}
                      </Title>
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
