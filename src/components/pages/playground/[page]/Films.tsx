import React, { useState } from "react";
import classNames from "classnames";

import { Button, Icon, Image, Link, Space, Title } from "~/components/primitive";
import { Render } from "~/components/pages/_shared";
import { useQuery } from "~/hooks";
import FilmsService from "~/services/films";
import { T_Film, T_ReactElement } from "~/types";
import { getScrollPosition, setScrollPosition, isInViewport } from "~/utils/browser";
import { FIXED_HEADER_HEIGHT } from "~/utils/constants";
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
          <div>
            <section>
              <Title
                is="h3"
                size={Title.size.MD}
                variant={Title.variant.SECONDARY}
                className="tw-mb-4"
              >
                Categorías [{categories.length}]
              </Title>
              <div className="tw-flex tw-justify-betweden tw-flex-wrap">
                {categories.map((category) => {
                  return (
                    <Button
                      key={category}
                      className={classNames(
                        "tw-mr-2 tw-my-1 tw-underlidne tw-inline-block tw-text-sm tw-py-1 tw-px-3 tw-rounded-md tw-text-left tw-truncate",
                        category === selectedCategory
                          ? "tw-bg-yellow-400 dark:tw-bg-yellow-600"
                          : "dfr-bg-secondary dark:dfr-bg-secondary",
                      )}
                      onClick={handleSelectFilter(category)}
                    >
                      {category}
                    </Button>
                  );
                })}
              </div>
            </section>
            <Space size={6} />

            <section>
              <Title
                is="h3"
                size={Title.size.MD}
                variant={Title.variant.SECONDARY}
                className="tw-mb-4"
              >
                Ordenar por
              </Title>
              <div className="tw-flex tw-justify-betweden tw-flex-wrap">
                <Button
                  className={classNames(
                    "tw-mr-2 tw-my-1 tw-underlidne tw-inline-block tw-text-sm tw-py-1 tw-px-3 tw-rounded-md tw-text-left tw-truncate",
                    isAddedDateFilterEnabled
                      ? "tw-bg-yellow-400 dark:tw-bg-yellow-600"
                      : "dfr-bg-secondary dark:dfr-bg-secondary",
                  )}
                  onClick={toggleOrderByFilter}
                >
                  Fecha
                </Button>
              </div>
            </section>
            <Space size={6} />

            <section>
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
              <div className="tw-flex tw-justify-center sm:tw-justify-between tw-flex-wrap">
                {films.map(({ id, source, title, type, calification, cover }, index) => {
                  return (
                    <Link
                      key={id}
                      href={
                        source === "Netflix"
                          ? `https://www.netflix.com/title/${id}`
                          : source === "YouTube"
                          ? `https://www.youtube.com/watch?v=${id}`
                          : `https://www.imdb.com/title/${id}`
                      }
                      variant={Link.variant.UNSTYLED}
                      className={classNames(
                        "film tw-relative tw-w-48 tw-h-64 tw-mb-6 tw-mx-2 tw-shadow-lg hover:tw-shadow-2xl tw-transform tw-duration-300 hover:tw--translate-y-1 hover:tw-translate-x-1 hover:tw-rotate-0 hover:tw-opacity-75",
                        index % 2 === 0 ? "sm:tw-rotate-2" : "sm:tw--rotate-2",
                      )}
                    >
                      <article
                        className="tw-flex tw-h-full tw-w-full"
                        style={{
                          backgroundImage: `url(${cover})`,
                          backgroundSize: "100% 100%",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        <span className="tw-absolute tw--top-2 tw--right-2 tw-bg-black dark:tw-bg-white tw-rounded-full tw-shadow-md tw-p-1 tw-w-8 tw-h-8">
                          <Icon
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
                        </span>

                        <div className="film__details tw-flex tw-self-end tw-flex-nowrap tw-justify-between tw-w-full tw-items-end tw-p-2">
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

                          <div className="tw-flex-1 tw-text-right">
                            <Title
                              is="h1"
                              variant={Title.variant.UNSTYLED}
                              className="tw-leading-tight tw-mb-2 tw-text-black tw-uppercase tw-break-normal"
                            >
                              {title}
                            </Title>
                            <p className="tw-text-sm tw-font-bold tw-leading-none tw-text-gray-700 tw-lowercase tw-italic">
                              {type}
                            </p>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </section>

            <style jsx>{`
              .film__details {
                background-color: rgba(255, 255, 255, 0.7);
              }
            `}</style>
          </div>
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
  const [isAddedDateFilterEnabled, setIsAddedDateFilterEnabled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
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
          setScrollPosition(getScrollPosition() - FIXED_HEADER_HEIGHT);
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
