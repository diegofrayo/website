import * as React from "react";
import classNames from "classnames";

import { Button, Icon, Image, Link, Space, Title, Block, Text } from "~/components/primitive";
import { Render } from "~/components/shared";
import { useQuery } from "~/hooks";
import FilmsService from "~/services/films";
import { T_Film, T_ReactElement } from "~/types";
import { getScrollPosition, setScrollPosition, isInViewport } from "~/utils/browser";
import { sortBy } from "~/utils/misc";
import { generateSlug } from "~/utils/strings";

function Films(): T_ReactElement {
  const {
    // states
    selectedCategory,
    isAddedDateFilterEnabled,

    // handlers
    handleSelectFilter,
    toggleOrderByFilter,

    // vars
    isLoading,
    error,
    data,
  } = useController();

  return (
    <Render isLoading={isLoading} error={error} data={data}>
      {({ films, categories }: { films: T_Film[]; categories: string[] }) => {
        return (
          <Block>
            <Block is="section">
              <Title
                is="h3"
                size={Title.size.MD}
                variant={Title.variant.SECONDARY}
                className="tw-mb-4"
              >
                Categorías [{categories.length}]
              </Title>
              <Block className="tw-flex tw-justify-betweden tw-flex-wrap">
                {categories.map((category) => {
                  return (
                    <Button
                      key={category}
                      variant={Button.variant.SIMPLE}
                      className={classNames(
                        "tw-mr-2 tw-my-1 tw-underlidne tw-inline-block tw-text-sm tw-py-1 tw-px-3 tw-rounded-md tw-text-left tw-truncate",
                        category === selectedCategory
                          ? "tw-bg-yellow-400 dark:tw-bg-yellow-600"
                          : "dfr-bg-color-primary dark:dfr-bg-color-primary",
                      )}
                      onClick={handleSelectFilter(category)}
                    >
                      {category}
                    </Button>
                  );
                })}
              </Block>
            </Block>
            <Space size={6} />

            <Block is="section">
              <Title
                is="h3"
                size={Title.size.MD}
                variant={Title.variant.SECONDARY}
                className="tw-mb-4"
              >
                Ordenar por
              </Title>
              <Block className="tw-flex tw-justify-betweden tw-flex-wrap">
                <Button
                  variant={Button.variant.SIMPLE}
                  className={classNames(
                    "tw-mr-2 tw-my-1 tw-underlidne tw-inline-block tw-text-sm tw-py-1 tw-px-3 tw-rounded-md tw-text-left tw-truncate",
                    isAddedDateFilterEnabled
                      ? "tw-bg-yellow-400 dark:tw-bg-yellow-600"
                      : "dfr-bg-color-primary dark:dfr-bg-color-primary",
                  )}
                  onClick={toggleOrderByFilter}
                >
                  Fecha
                </Button>
              </Block>
            </Block>
            <Space size={6} />

            <Block is="section">
              <Title
                is="h3"
                size={Title.size.MD}
                variant={Title.variant.SECONDARY}
                className="tw-mb-4"
                id="results"
              >
                {selectedCategory ? `Resultados de "${selectedCategory}"` : "Resultados"} [
                {films.length}]
              </Title>
              <Block className="tw-flex tw-justify-center sm:tw-justify-between tw-flex-wrap">
                {films.map(({ id, source, title, type, calification, cover }, index) => {
                  return (
                    <Link
                      key={id}
                      variant={Link.variant.UNSTYLED}
                      href={
                        source === "Netflix"
                          ? `https://www.netflix.com/title/${id}`
                          : source === "YouTube"
                          ? `https://www.youtube.com/watch?v=${id}`
                          : `https://www.imdb.com/title/${id}`
                      }
                      className={classNames(
                        "tw-relative tw-w-48 tw-h-64 tw-mb-6 tw-mx-2 tw-shadow-lg hover:tw-shadow-2xl tw-transform tw-duration-300 hover:tw--translate-y-1 hover:tw-translate-x-1 hover:tw-rotate-0 hover:tw-opacity-75",
                        index % 2 === 0 ? "sm:tw-rotate-2" : "sm:tw--rotate-2",
                      )}
                      isExternalUrl
                    >
                      <article
                        className="tw-flex tw-h-full tw-w-full tw-bg-no-repeat"
                        style={{
                          backgroundImage: `url(${cover})`,
                          backgroundSize: "100% 100%",
                        }}
                      >
                        <Icon
                          wrapperClassName="tw-absolute tw--top-2 tw--right-2 tw-bg-black dark:tw-bg-white tw-rounded-full tw-shadow-md tw-p-1 tw-w-8 tw-h-8"
                          icon={
                            calification === 5
                              ? Icon.icon.STAR
                              : calification === 4
                              ? Icon.icon.HEART
                              : calification === 3
                              ? Icon.icon.CHECK
                              : Icon.icon.MINUS
                          }
                          size={24}
                        />

                        <Block className="dfr-bg-color-light-strong tw-bg-opacity-70 tw-flex tw-self-end tw-flex-nowrap tw-justify-between tw-w-full tw-items-end tw-p-2">
                          {source === "imdb" ? (
                            <Image
                              src="/static/images/misc/imdb.png"
                              className="tw-w-6 tw-h-6 tw-rounded-full tw-flex-shrink-0"
                              alt="imdb icon"
                            />
                          ) : source === "Amazon Prime Video" ? (
                            <Image
                              src="/static/images/misc/amazon-prime-video.png"
                              className="tw-w-6 tw-h-6 tw-rounded-full tw-flex-shrink-0"
                              alt="Amazon Prime Video icon"
                            />
                          ) : (
                            <Icon
                              icon={source === "Netflix" ? Icon.icon.NETFLIX : Icon.icon.YOUTUBE}
                              size={24}
                              wrapperClassName="tw-flex-shrink-0"
                            />
                          )}

                          <Block className="tw-flex-1 tw-text-right">
                            <Title
                              is="h1"
                              variant={Title.variant.UNSTYLED}
                              className="tw-leading-tight tw-mb-2 tw-text-black tw-uppercase tw-break-normal"
                            >
                              {title}
                            </Title>
                            <Text className="tw-text-sm tw-font-bold tw-leading-none tw-text-gray-700 tw-lowercase tw-italic">
                              {type}
                            </Text>
                          </Block>
                        </Block>
                      </article>
                    </Link>
                  );
                })}
              </Block>
            </Block>
          </Block>
        );
      }}
    </Render>
  );
}

export default Films;

// --- Controller ---

function useController(): {
  isLoading: boolean;
  error: unknown;
  data:
    | {
        films: T_Film[];
        categories: string[];
      }
    | undefined;
  selectedCategory: string;
  isAddedDateFilterEnabled: boolean;
  handleSelectFilter: (filter: string) => () => void;
  toggleOrderByFilter: () => void;
} {
  const [isAddedDateFilterEnabled, setIsAddedDateFilterEnabled] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const { isLoading, error, data } = useQuery<T_Film[]>("films", FilmsService.fetchFilms);

  function filterFilms(films: T_Film[], filter: string): T_Film[] {
    if (!filter) return films;

    return films.filter((film) => {
      return (
        filter === film.source.toLowerCase() ||
        filter === film.type.toLowerCase() ||
        film.categories.includes(filter)
      );
    });
  }

  function handleSelectFilter(category) {
    return () => {
      setSelectedCategory(category === selectedCategory ? "" : category);

      const resultsTitleElement = document.getElementById("results");
      if (!resultsTitleElement) return;

      if (!isInViewport(resultsTitleElement)) {
        resultsTitleElement.scrollIntoView();
        setTimeout(() => {
          setScrollPosition(getScrollPosition());
        }, 10);
      }
    };
  }

  function toggleOrderByFilter() {
    setIsAddedDateFilterEnabled((pv) => !pv);
  }

  return {
    // states
    selectedCategory,
    isAddedDateFilterEnabled,

    // handlers
    handleSelectFilter,
    toggleOrderByFilter,

    // vars
    isLoading,
    error,
    data: data
      ? {
          films: filterFilms(data, selectedCategory).sort(
            sortBy(
              isAddedDateFilterEnabled
                ? [{ param: "addedDate", order: "desc" }]
                : [
                    { param: "calification", order: "desc" },
                    { param: "title", order: "asc" },
                  ],
            ),
          ),
          categories: Object.values({
            peliculas: "película",
            series: "serie",
            documentales: "documental",
            serie_documental: "serie documental",
            netflix: "netflix",
            youtube: "youtube",
            amazon_primer_video: "amazon prime video",
          }).concat(
            Object.values(
              data.reduce((result, film) => {
                film.categories.forEach((category) => {
                  if (category === "documental") return;
                  result[generateSlug(category)] = category;
                });

                return result;
              }, {}),
            ).sort() as string[],
          ),
        }
      : undefined,
  };
}
