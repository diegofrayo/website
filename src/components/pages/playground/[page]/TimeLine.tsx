import React, { Fragment, useState } from "react";
import classNames from "classnames";

import { Emoji, Render } from "~/components/pages/_shared";
import { Button, Space, Title } from "~/components/primitive";
import { useQuery } from "~/hooks";
import TimeLineService from "~/services/timeline";
import { T_TimeLine, T_ReactElement } from "~/types";

function TimeLine(): T_ReactElement {
  const {
    // states
    selectedCategory,

    // handlers
    handleSelectFilter,
    formatDate,

    // vars
    isLoading,
    error,
    data,
  } = useController();

  return (
    <Render isLoading={isLoading} error={error} data={data}>
      {({ categories, items }: T_TimeLine) => {
        return (
          <Fragment>
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
                      key={category.id}
                      className={classNames(
                        "tw-mr-2 tw-my-1 tw-underlidne tw-inline-block tw-text-sm tw-font-bold tw-py-1 tw-px-3 tw-rounded-md tw-text-left tw-truncate",
                        category.id === selectedCategory
                          ? "tw-bg-yellow-400 dark:tw-bg-yellow-600"
                          : "dfr-bg-secondary dark:dfr-bg-secondary",
                      )}
                      onClick={handleSelectFilter(category.id)}
                    >
                      <Emoji>{category.emoji}</Emoji> {category.value}
                    </Button>
                  );
                })}
              </div>
            </section>
            <Space size={6} />

            {items.map((item) => {
              return (
                <section key={item.year}>
                  <Title
                    is="h2"
                    className="tw-text-left sm:tw-text-center tw-my-8 tw-underline"
                    variant={Title.variant.SECONDARY}
                    size={Title.size.LG}
                  >
                    {item.year}
                  </Title>

                  {item.items.map((item, index) => {
                    return (
                      <div
                        key={item.id}
                        className={classNames(
                          "tw-relative sm:tw-w-1/2 tw-border-black dark:tw-border-white tw-px-4 tw-pb-8 last:tw-pb-0 tw-border-l-4",
                          index % 2 === 0
                            ? "sm:tw-border-l-0 sm:tw-border-r-4 sm:tw-text-right sm:tw-ml-1"
                            : "sm:tw-left-2/4",
                        )}
                      >
                        <p className="tw-text-sm">
                          <Emoji>🗓</Emoji> <span>{formatDate(item.startDate, item.endDate)}</span>
                        </p>
                        <p className="tw-font-bold tw-text-xl tw-my-2">{item.description}</p>
                        <div>
                          {item.categories.map((category) => {
                            return (
                              <span
                                key={category.id}
                                className="tw-font-bold tw-text-xs tw-px-2 tw-py-1 tw-rounded-md tw-border dfr-border-color-primary dark:dfr-border-color-primary"
                              >
                                {category.value}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </section>
              );
            })}
          </Fragment>
        );
      }}
    </Render>
  );
}

export default TimeLine;

// --- Controller ---

function useController(): {
  isLoading: boolean;
  error: unknown;
  data?: T_TimeLine;
  selectedCategory: string;
  handleSelectFilter: (filter: string) => () => void;
  formatDate: any;
} {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { isLoading, error, data } = useQuery("items", TimeLineService.fetchData);

  function handleSelectFilter(category) {
    return () => {
      setSelectedCategory(category === selectedCategory ? "" : category);
    };
  }

  function formatDate(startDate, endDate) {
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
    let output = `${Number(startDateItems[2])} de ${MONTHS[Number(startDateItems[1]) - 1]}`;

    if (endDate) {
      const endDateItems = endDate.split("/");
      const haveStartAndEndDateDifferentYear = startDateItems[0] !== endDateItems[0];

      output += `${haveStartAndEndDateDifferentYear ? " del " + startDateItems[0] : ""} al ${Number(
        endDateItems[2],
      )} de ${MONTHS[Number(endDateItems[1]) - 1]}${
        haveStartAndEndDateDifferentYear ? " del " + endDateItems[0] : ""
      }`;
    }

    return output;
  }

  return {
    // states
    selectedCategory,

    // handlers
    handleSelectFilter,
    formatDate,

    // vars
    isLoading,
    error,
    data: data
      ? {
          categories: data.categories,
          items: data.items.map((item) => {
            return {
              ...item,
              items: selectedCategory
                ? item.items.filter((item) => {
                    return (
                      item.categories.find((category) => category.id === selectedCategory) !==
                      undefined
                    );
                  })
                : item.items,
            };
          }),
        }
      : undefined,
  };
}
